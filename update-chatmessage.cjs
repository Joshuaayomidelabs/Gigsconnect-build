const fs = require('fs');
let content = fs.readFileSync('src/components/messages/ChatMessage.tsx', 'utf-8');

if (!content.includes('import Linkify from')) {
  content = content.replace("import { Trash2, Check, CheckCheck } from 'lucide-react';", "import { Trash2, Check, CheckCheck } from 'lucide-react';\nimport Linkify from 'linkify-react';");
}

const pTagOld = `<p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>`;
const pTagNew = `<p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              <Linkify options={{
                className: 'text-blue-500 hover:underline',
                target: '_blank'
              }}>
                {message.content}
              </Linkify>
            </p>`;
            
content = content.replace(pTagOld, pTagNew);
fs.writeFileSync('src/components/messages/ChatMessage.tsx', content, 'utf-8');
