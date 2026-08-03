const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/Chat.tsx');
let content = fs.readFileSync(p, 'utf-8');

// replace useEffects and state
const oldStateStart = `const [messages, setMessages] = useState<Message[]>([]);`;
const oldStateEnd = `  const scrollToBottom = () => {`;
const oldStateBlock = content.substring(content.indexOf(oldStateStart), content.indexOf(oldStateEnd));

const newStateBlock = `const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  
  const [inputText, setInputText] = useState('');
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
    const messageChannel = supabase.channel(\`chat_\${conversationId}\`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: \`conversation_id=eq.\${conversationId}\` }, (payload) => {
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
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversation_participants', filter: \`conversation_id=eq.\${conversationId}\` }, (payload) => {
         // The other user updated their read status
         if (payload.new.user_id !== user.id && isMounted) {
           setMessages(prev => prev.map(m => 
             m.sender_id === user.id ? { ...m, local_status: 'read' } : m
           ));
         }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [conversationId, user]);

`;

content = content.replace(oldStateBlock, newStateBlock);

// Replace scrollToBottom
const oldScroll = `  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);`;

const newScroll = `  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowScrollDown(false);
  };`;

content = content.replace(oldScroll, newScroll);

// Replace handleSend to add 'temp_'
const oldHandleSend = `      // Optimistic update
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
        message_type: 'text',
        created_at: new Date().toISOString()
      } as Message]);`;

const newHandleSend = `      // Optimistic update
      setMessages(prev => [...prev, {
        id: 'temp_' + Date.now().toString(),
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
        message_type: 'text',
        created_at: new Date().toISOString(),
        local_status: 'sent'
      } as Message]);
      setTimeout(() => scrollToBottom('smooth'), 50);`;

content = content.replace(oldHandleSend, newHandleSend);

// Now the UI for online status and offline warning
content = content.replace(`<div className="flex items-center gap-3">
              {otherUser?.avatar_url ? (`, `<div className="flex items-center gap-3 relative">
              <div className="relative">
                {otherUser?.avatar_url ? (`);
                
content = content.replace(`          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </header>`, `          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </header>
        
        {!isOnline && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 text-center text-xs text-yellow-700 dark:text-yellow-500 border-b border-yellow-100 dark:border-yellow-900/50 z-10 shrink-0">
            Waiting for connection...
          </div>
        )}`);

// Fix the other user's name area to add "Online" or "Last seen" (if not online)
const headerName = `<div>
                <h2 className="font-bold text-brand-black dark:text-brand-white text-sm sm:text-base leading-tight">
                  {otherUser?.full_name || 'Loading...'}
                </h2>
              </div>`;
              
const newHeaderName = `<div>
                <h2 className="font-bold text-brand-black dark:text-brand-white text-sm sm:text-base leading-tight">
                  {otherUser?.full_name || 'Loading...'}
                </h2>
                {otherUser && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <span className={\`w-2 h-2 rounded-full \${isOtherUserOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}\`}></span>
                    {isOtherUserOnline ? 'Online' : 'Offline'}
                  </p>
                )}
              </div>`;

content = content.replace(headerName, newHeaderName);

// Close the div we opened around avatar
content = content.replace(`                </div>
              )}
              <div>`, `                </div>
              )}
              </div>
              <div>`);

// Add ScrollContainerRef and floating button
content = content.replace(`<div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-brand-gray dark:bg-brand-black sm:bg-transparent">`, `<div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-brand-gray dark:bg-brand-black sm:bg-transparent relative"
        >`);

// Floating button
const floatingBtn = `          <div ref={messagesEndRef} />
        </div>`;
const newFloatingBtn = `          <div ref={messagesEndRef} className="h-4" />
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
        </div>`;
content = content.replace(floatingBtn, newFloatingBtn);

fs.writeFileSync(p, content, 'utf-8');
console.log('Replaced hooks in Chat.tsx');
