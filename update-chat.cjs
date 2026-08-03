const fs = require('fs');
let content = fs.readFileSync('src/pages/Chat.tsx', 'utf-8');

// Import RichComposer
if (!content.includes("import { RichComposer }")) {
  content = content.replace("import { ChatMessage } from '../components/messages/ChatMessage';", "import { ChatMessage } from '../components/messages/ChatMessage';\nimport { RichComposer } from '../components/messages/RichComposer';");
}

// Update handleSend
const oldHandleSend = `  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId || !user) return;
    
    const content = inputText.trim();
    setInputText('');
    setSending(true);
    
    try {
      await sendMessage(conversationId, content);
      
      // Optimistic update
      setMessages(prev => [...prev, {
        id: 'temp_' + Date.now().toString(),
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
        message_type: 'text',
        created_at: new Date().toISOString(),
        local_status: 'sent'
      } as Message]);
      setTimeout(() => scrollToBottom('smooth'), 50);
      
    } catch (err) {
      handleError(err, 'Send Message Error');
      throw err; // To let RichComposer know
    } finally {
      setSending(false);
    }
  };`;

const newHandleSend = `  const handleSend = async (content: string) => {
    if (!content.trim() || !conversationId || !user) return;
    
    setSending(true);
    
    try {
      await sendMessage(conversationId, content);
      
      // Optimistic update
      setMessages(prev => [...prev, {
        id: 'temp_' + Date.now().toString(),
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
        message_type: 'text',
        created_at: new Date().toISOString(),
        local_status: 'sent'
      } as Message]);
      setTimeout(() => scrollToBottom('smooth'), 50);
      
    } catch (err) {
      handleError(err, 'Send Message Error');
      throw err;
    } finally {
      setSending(false);
    }
  };`;
  
// I have to just use string replace using substring because the old handleSend might differ slightly in whitespace.
const handleSendRegex = /const handleSend = async \(e: React\.FormEvent\) => \{[\s\S]*?finally \{\s*setSending\(false\);\s*\}\s*\};/;
content = content.replace(handleSendRegex, newHandleSend);

// Remove inputText state
content = content.replace("const [inputText, setInputText] = useState('');\n", "");

// Replace Composer JSX
const composerRegex = /\{\/\* Composer \*\/\}([\s\S]*?)<\/form>\s*<\/div>/;
const newComposer = `{/* Composer */}
        <RichComposer 
          conversationId={conversationId || ''} 
          onSend={handleSend} 
          sending={sending} 
        />`;
content = content.replace(composerRegex, newComposer);

fs.writeFileSync('src/pages/Chat.tsx', content, 'utf-8');
