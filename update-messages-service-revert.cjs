const fs = require('fs');
let content = fs.readFileSync('src/services/messagesService.ts', 'utf-8');

const oldFunc = `export const getOrCreateDirectConversation = async (otherUserId: string): Promise<string> => {
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
};`;

const newFunc = `export const getOrCreateDirectConversation = async (otherUserId: string): Promise<string> => {
  const { data, error } = await supabase.rpc('get_or_create_direct_conversation', {
    other_user_id: otherUserId
  });
  if (error) {
    throw error;
  }
  return data as string;
};`;

if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  fs.writeFileSync('src/services/messagesService.ts', content, 'utf-8');
  console.log('Reverted getOrCreateDirectConversation to use RPC');
} else {
  console.log('Could not find oldFunc in messagesService.ts');
}
