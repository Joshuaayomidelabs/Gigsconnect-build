const fs = require('fs');
let content = fs.readFileSync('src/components/messages/ChatMessage.tsx', 'utf-8');

const pTagOld = `<Linkify options={{
                className: 'text-blue-500 hover:underline',
                target: '_blank'
              }}>`;
const pTagNew = `<Linkify options={{
                className: isMe ? 'underline underline-offset-2' : 'text-brand-purple dark:text-brand-purple hover:underline underline-offset-2',
                target: '_blank'
              }}>`;
              
content = content.replace(pTagOld, pTagNew);
fs.writeFileSync('src/components/messages/ChatMessage.tsx', content, 'utf-8');
