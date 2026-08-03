const fs = require('fs');
let content = fs.readFileSync('src/pages/Chat.tsx', 'utf-8');

const oldTryCatch = `    try {
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
    }`;

const newTryCatch = `    const tempId = 'temp_' + Date.now().toString();
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
    }`;

content = content.replace(oldTryCatch, newTryCatch);
fs.writeFileSync('src/pages/Chat.tsx', content, 'utf-8');
