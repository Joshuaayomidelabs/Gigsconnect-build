import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import { ConversationInboxItem, fetchConversations } from '../services/messagesService';
import { ConversationCard } from '../components/messages/ConversationCard';
import { EmptyState } from '../components/messages/EmptyState';
import { LoadingSkeleton } from '../components/messages/LoadingSkeleton';
import { SearchInput } from '../components/messages/SearchInput';
import { handleError } from '../utils/errorHandler';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationInboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = async (refresh = false, silent = false) => {
    try {
      if (silent) { /* do nothing */ } else if (refresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await fetchConversations();
      setConversations(data || []);
    } catch (err) {
      handleError(err, "Load Messages Error");
    } finally {
      if (!silent) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    loadConversations();
    
    if (!user) return;
    
    // Subscribe to multiple tables
    const channel = supabase.channel('inbox_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        loadConversations(false, true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_participants' }, (payload) => {
        loadConversations(false, true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        loadConversations(false, true);
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          // Silent or toast? No toast needed if no error state, just let it be since they can pull to refresh
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(c => 
      c.full_name?.toLowerCase().includes(query) ||
      c.username?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  return (
    <div className="pt-main pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-brand-gray dark:bg-brand-black flex justify-center">
      <div className="w-full max-w-[600px] flex flex-col h-[calc(100vh-80px)]">
        
        <header className="py-6 shrink-0 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight">
            Messages
          </h1>
          <button 
            onClick={() => loadConversations(true)}
            disabled={isRefreshing || loading}
            className="p-2 bg-brand-white dark:bg-brand-dark-card rounded-full shadow-soft hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            aria-label="Refresh messages"
          >
            <Loader2 className={`w-5 h-5 text-gray-500 ${isRefreshing ? 'animate-spin text-brand-purple' : ''}`} />
          </button>
        </header>

        <div className="mb-6 shrink-0">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search messages..."
          />
        </div>

        <div className="flex-1 overflow-hidden bg-transparent">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 font-medium">No results found.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try another keyword.</p>
              </div>
            ) : (
              <EmptyState />
            )
          ) : (
            <Virtuoso
              data={filteredConversations}
              className="w-full h-full"
              itemContent={(_index, conversation) => (
                <div className="pb-2">
                  <ConversationCard conversation={conversation} />
                </div>
              )}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
