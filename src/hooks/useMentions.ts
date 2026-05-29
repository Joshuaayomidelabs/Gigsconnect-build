import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useMentions(text: string, cursorPosition: number) {
  const [mentionState, setMentionState] = useState<{ query: string, start: number, end: number } | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const textBeforeCursor = text.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/(?:^|\s)@([a-zA-Z0-9_]*)$/);
    
    if (match) {
      const query = match[1];
      const start = match.index === 0 ? 0 : match.index! + 1;
      const end = cursorPosition;
      
      setMentionState({ query, start, end });
      
      const fetchUsers = async () => {
         setLoading(true);
         const { data } = await supabase
           .from('profiles')
           .select('id, user_id, full_name, username, avatar_url')
           .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
           .limit(5);
           
         if (data) {
           setResults(data);
         }
         setLoading(false);
      };
      
      const timer = setTimeout(fetchUsers, 300);
      return () => clearTimeout(timer);
    } else {
      setMentionState(null);
      setResults([]);
    }
  }, [text, cursorPosition]);

  return { mentionState, results, loading };
}
