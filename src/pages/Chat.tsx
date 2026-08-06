import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchMessages, sendMessage, markConversationRead, Message } from '../services/messagesService';
import { supabase } from '../services/supabaseClient';
import { handleError } from '../utils/errorHandler';
import { ChatMessage } from '../components/messages/ChatMessage';
import { RichComposer } from '../components/messages/RichComposer';
import { isSameDay, format } from 'date-fns';

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  
    const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Show button if not at bottom (buffer of 100px)
    if (scrollHeight - scrollTop - clientHeight > 100) {
      setShowScrollDown(true);
    } else {
      setShowScrollDown(false);
    }
  };

  useEffect(() => {
    if (!conversationId || !user) return;
    
    let isMounted = true;
    let otherId = '';

    const loadData = async () => {
      try {
        setLoading(true);
        setErrorState(null);
        
        try {
          await markConversationRead(conversationId);
        } catch (e) {
          console.warn("Failed to mark as read", e);
        }

        try {
          const { data: inboxData } = await supabase
            .from('conversation_inbox')
            .select('*')
            .eq('conversation_id', conversationId)
            .limit(1)
            .maybeSingle();

          if (inboxData && isMounted) {
            otherId = inboxData.other_user_id;
            setOtherUserId(otherId);
            const profileInfo = {
              full_name: inboxData.full_name,
              avatar_url: inboxData.avatar_url,
              is_verified: inboxData.is_verified,
              subscription_tier: inboxData.subscription_tier
            };
            
            if (!inboxData.avatar_url) {
              const { data: profData } = await supabase.from('profiles').select('avatar_url, is_verified, subscription_tier').eq('id', inboxData.other_user_id).maybeSingle();
              if (profData && isMounted) {
                profileInfo.avatar_url = profData.avatar_url;
                profileInfo.is_verified = profData.is_verified;
                profileInfo.subscription_tier = profData.subscription_tier;
              }
            }
            if (isMounted) setOtherUser(profileInfo);
          }
        } catch (e) {
          console.warn("Failed to load header info", e);
        }

        try {
          const msgs = await fetchMessages(conversationId);
          if (isMounted) {
             // Assume all fetched past messages are read by the other user if we are the sender
             // We can't know for sure without conversation_participants, but delivered is safe, or read for older ones.
             const enriched = msgs.map(m => ({
               ...m,
               local_status: m.sender_id === user.id ? 'read' : undefined
             })) as Message[];
             setMessages(enriched);
          }
        } catch (err: any) {
          if (err.code === '42P17' && isMounted) { 
              setErrorState('Unable to load messages at this time due to backend constraints.');
          } else {
              throw err;
          }
        }
        
      } catch (err: any) {
        if (isMounted) {
          handleError(err, 'Load Chat Error');
          setErrorState('Failed to load messages.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setTimeout(() => scrollToBottom(), 100);
        }
      }
    };
    
    loadData();

    // Subscribe to presence
    const presenceChannel = supabase.channel('online-users');
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        if (otherId) {
          // Check if other user is in any of the presence states
          const isOnlineNow = Object.values(state).some(
            (presences: any) => presences.some((p: any) => p.user_id === otherId)
          );
          if (isMounted) setIsOtherUserOnline(isOnlineNow);
          
          if (isOnlineNow && isMounted) {
            // If they are online, assume they read our messages since they are in chat?
            // Actually, they might be online in the app but not in this chat.
            // But we can mark all our 'delivered' messages as 'read' if we want.
          }
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: user.id, online_at: new Date().toISOString() });
        }
      });

    // Subscribe to messages
    const messageChannel = supabase.channel(`chat_${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        if (isMounted) {
          const newMsg = payload.new as Message;
          
          setMessages(prev => {
            // Deduplicate (in case optimistic UI added it, though they will have different IDs, we can match on exact content and timestamp closeness, or just rely on server ID)
            // But optimistic temp message has a temp ID. Let's just remove the first temp message that matches the content.
            const tempIndex = prev.findIndex(m => m.sender_id === user.id && m.content === newMsg.content && m.id.startsWith('temp_'));
            
            if (tempIndex !== -1) {
              const updated = [...prev];
              updated[tempIndex] = { ...newMsg, local_status: 'delivered' };
              return updated;
            } else {
              // It's a brand new message (from them or from another device)
              if (newMsg.sender_id === user.id) {
                 newMsg.local_status = 'delivered';
              }
              // Auto scroll if at bottom
              const shouldScroll = scrollContainerRef.current ? 
                (scrollContainerRef.current.scrollHeight - scrollContainerRef.current.scrollTop - scrollContainerRef.current.clientHeight < 150) : true;
                
              if (shouldScroll) {
                setTimeout(() => scrollToBottom('smooth'), 100);
              } else {
                setShowScrollDown(true);
              }
              
              return [...prev, newMsg];
            }
          });
          
          // If we received a message from them, mark as read
          if (newMsg.sender_id !== user.id) {
            markConversationRead(conversationId).catch(console.warn);
          }
        }
      })
      .on('system', { event: '*' }, (payload) => {
         // Handle system events if needed
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversation_participants', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
         // The other user updated their read status
         if (payload.new.user_id !== user.id && isMounted) {
           setMessages(prev => prev.map(m => 
             m.sender_id === user.id ? { ...m, local_status: 'read' } : m
           ));
         }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' && isMounted) {
          setErrorState('Live updates unavailable. Please check your connection.');
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [conversationId, user]);

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowScrollDown(false);
  };

    const handleSend = async (content: string) => {
    if (!content.trim() || !conversationId || !user) return;
    
    setSending(true);
    
    const tempId = 'temp_' + Date.now().toString();
    try {
      // Optimistic update first!
      setMessages(prev => [...prev, {
        id: tempId,
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
        message_type: 'text',
        created_at: new Date().toISOString(),
        local_status: 'sent'
      } as Message]);
      setTimeout(() => scrollToBottom('smooth'), 50);

      await sendMessage(conversationId, content);
      
    } catch (err) {
      // Remove optimistic update
      setMessages(prev => prev.filter(m => m.id !== tempId));
      handleError(err, "Couldn't send message.");
      throw err;
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-main min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-brand-gray dark:bg-brand-black flex flex-col sm:static sm:z-auto sm:pt-main sm:min-h-screen sm:pb-24 sm:px-4 lg:px-8 sm:flex-row sm:justify-center">
      <div className="flex flex-col w-full h-full sm:h-[calc(100vh-80px)] sm:max-w-[600px] sm:border sm:border-gray-200 dark:sm:border-gray-800 sm:rounded-2xl sm:overflow-hidden sm:shadow-soft sm:bg-brand-white dark:sm:bg-brand-dark-card relative">
        {/* Header */}
        <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-brand-white dark:bg-brand-dark-card border-b border-gray-200 dark:border-gray-800 z-10 pt-safe sm:pt-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-brand-black dark:text-brand-white" />
            </button>
            
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                {otherUser?.avatar_url ? (
                <img src={otherUser.avatar_url} alt="User" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <span className="font-bold text-gray-500">
                    {otherUser?.full_name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              </div>
              <div>
                <h2 className="font-bold text-brand-black dark:text-brand-white text-sm sm:text-base leading-tight">
                  {otherUser?.full_name || 'Loading...'}
                </h2>
                {otherUser && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isOtherUserOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                    {isOtherUserOnline ? 'Online' : 'Offline'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </header>
        
        {!isOnline && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 text-center text-xs text-yellow-700 dark:text-yellow-500 border-b border-yellow-100 dark:border-yellow-900/50 z-10 shrink-0">
            Waiting for connection...
          </div>
        )}

        {/* Messages Area */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-brand-gray dark:bg-brand-black sm:bg-transparent relative"
        >
          {errorState ? (
            <div className="text-center py-10 px-4 text-gray-500 dark:text-gray-400">
              <p>{errorState}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 px-4 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
              <p className="font-medium text-brand-black dark:text-brand-white mb-1">Say hello!</p>
              <p className="text-sm">This is the beginning of your conversation.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender_id === user?.id;
              const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.sender_id === user?.id);
              
              const currentMsgDate = new Date(msg.created_at);
              const prevMsgDate = index > 0 ? new Date(messages[index - 1].created_at) : null;
              const showDateDivider = !prevMsgDate || !isSameDay(currentMsgDate, prevMsgDate);
              
              return (
                <React.Fragment key={msg.id}>
                  {showDateDivider && (
                    <div className="flex justify-center my-6">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs font-medium text-gray-500">
                        {format(currentMsgDate, 'MMMM d, yyyy')}
                      </div>
                    </div>
                  )}
                  <ChatMessage 
                    message={msg}
                    isMe={isMe}
                    showAvatar={showAvatar}
                    otherUserAvatar={otherUser?.avatar_url}
                    otherUserInitial={otherUser?.full_name?.charAt(0)}
                  />
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} className="h-4" />
          {showScrollDown && (
            <div className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none pb-2">
              <button 
                onClick={() => scrollToBottom('smooth')}
                className="pointer-events-auto bg-brand-white dark:bg-brand-dark-card border border-gray-200 dark:border-gray-800 text-brand-black dark:text-brand-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all transform translate-y-0"
              >
                <span className="text-brand-purple dark:text-brand-purple">↓</span> New Messages
              </button>
            </div>
          )}
        </div>

        {/* Composer */}
        <RichComposer 
          conversationId={conversationId || ''} 
          onSend={handleSend} 
          sending={sending} 
        />
      </div>
    </div>
  );
};


import { toast as sonnerToast } from 'sonner';
import { useNavigate as useFrozenNavigate } from 'react-router-dom';

const FrozenComponent: React.FC = () => {
  const navigate = useFrozenNavigate();
  
  React.useEffect(() => {
    sonnerToast('Messaging is coming soon.', {
      description: "We're working on bringing messaging to GigsConnect."
    });
    navigate('/overview', { replace: true });
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-brand-white dark:bg-brand-black">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">Messaging is coming soon</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting...</p>
      </div>
    </div>
  );
};

export default FrozenComponent;

