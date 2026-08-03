const fs = require('fs');
let content = fs.readFileSync('src/pages/Messages.tsx', 'utf-8');

const oldHooks = `const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationInboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = async (refresh = false) => {`;

const newHooks = `const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationInboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = async (refresh = false, silent = false) => {`;

content = content.replace(oldHooks, newHooks);

const oldLoadEnd = `    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);`;

const newLoadEnd = `    } finally {
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);`;

content = content.replace(oldLoadEnd, newLoadEnd);

content = content.replace("if (refresh) {", "if (silent) { /* do nothing */ } else if (refresh) {");

fs.writeFileSync('src/pages/Messages.tsx', content, 'utf-8');
