import { supabase } from './supabaseClient';
import { moderationService } from './moderationService';

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
  const { data, error } = await supabase.rpc('get_or_create_direct_conversation', {
    other_user: otherUserId
  });
  if (error) {
    throw error;
  }
  return data as string;
};

export const fetchConversations = async (): Promise<ConversationInboxItem[]> => {
  const { data, error } = await supabase
    .from('conversation_inbox')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  const inboxItems = (data || []).map((row: any) => ({
    ...row,
    avatar_url: row.avatar_url ?? row.profile_photo,
    is_verified: row.is_verified ?? (String(row.verification_status || '').toLowerCase() === 'verified'),
    subscription_tier: row.subscription_tier ?? row.subscription_plan
  })) as ConversationInboxItem[];
  
  return inboxItems;
};

export const getUnreadMessagesCount = async (userId?: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('conversation_inbox')
      .select('other_user_id, unread_count');

    if (error || !data) return 0;

    let blockedIds: string[] = [];
    if (userId) {
      const { data: bData } = await moderationService.getBlockedUsers(userId);
      if (bData && Array.isArray(bData)) {
        blockedIds = bData;
      }
    }

    const filtered = blockedIds.length > 0
      ? data.filter((curr: any) => !blockedIds.includes(curr.other_user_id))
      : data;

    return filtered.reduce((acc: number, curr: any) => acc + (Number(curr.unread_count) || 0), 0);
  } catch (err) {
    console.error('Failed to get unread messages count:', err);
    return 0;
  }
};
