import { supabase } from './supabaseClient';

export interface ConversationInboxItem {
  conversation_id: string;
  other_user_id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  is_verified?: boolean;
  subscription_tier?: string;
  last_message: string;
  message_type: 'text' | 'image' | 'video' | 'voice' | 'document' | 'portfolio' | 'gig';
  updated_at: string;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'voice' | 'document' | 'portfolio' | 'gig';
  created_at: string;
  edited_at?: string | null;
  is_deleted?: boolean;
  local_status?: 'sent' | 'delivered' | 'read';
}

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }
  return data as Message[];
};

export const sendMessage = async (conversationId: string, content: string, messageType: string = 'text'): Promise<void> => {
  const { error } = await supabase.rpc('send_message', {
    p_conversation_id: conversationId,
    p_content: content,
    p_message_type: messageType
  });

  if (error) {
    throw error;
  }
};

export const markConversationRead = async (conversationId: string): Promise<void> => {
  const { error } = await supabase.rpc('mark_conversation_read', {
    p_conversation_id: conversationId
  });

  if (error) {
    throw error;
  }
};

export const getOrCreateDirectConversation = async (otherUserId: string): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check for existing conversation
  const { data: existing, error: checkError } = await supabase
    .from('conversation_inbox')
    .select('conversation_id')
    .eq('other_user_id', otherUserId)
    .limit(1)
    .maybeSingle();

  if (existing && existing.conversation_id) {
    return existing.conversation_id;
  }

  // Insert a new conversation
  const { data: convData, error: convError } = await supabase
    .from('conversations')
    .insert({})
    .select('id')
    .single();

  if (convError || !convData) {
    throw convError || new Error('Failed to create conversation');
  }

  // Insert both participants
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: convData.id, user_id: user.id },
      { conversation_id: convData.id, user_id: otherUserId }
    ]);

  if (partError) {
    throw partError;
  }

  return convData.id;
};

export const fetchConversations = async (): Promise<ConversationInboxItem[]> => {

  const { data, error } = await supabase
    .from('conversation_inbox')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  // if view doesn't have avatar_url etc, we might fetch it?
  // Let's just return the data first. If we need to fetch missing data, we can do it here.
  const inboxItems = data as ConversationInboxItem[];
  
  // Let's fetch missing profile info in bulk if we need to.
  // We'll check the first item to see if it's missing avatar_url.
  if (inboxItems.length > 0 && typeof inboxItems[0].avatar_url === 'undefined') {
      const userIds = inboxItems.map(item => item.other_user_id);
      const { data: profiles, error: profErr } = await supabase
          .from('profiles')
          .select('id, avatar_url, is_verified, subscription_tier')
          .in('id', userIds);
          
      if (profiles && !profErr) {
          const profileMap = new Map(profiles.map(p => [p.id, p]));
          for (const item of inboxItems) {
              const prof = profileMap.get(item.other_user_id);
              if (prof) {
                  item.avatar_url = prof.avatar_url;
                  item.is_verified = prof.is_verified;
                  item.subscription_tier = prof.subscription_tier;
              }
          }
      }
  }
  
  return inboxItems;
};
