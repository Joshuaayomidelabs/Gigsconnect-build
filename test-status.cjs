const fs = require('fs');
let content = fs.readFileSync('src/pages/Chat.tsx', 'utf-8');
content = content.replace("            markConversationRead(conversationId).catch(console.warn);\n          }\n        }\n      })", "            markConversationRead(conversationId).catch(console.warn);\n          }\n        }\n      })\n      .on('system', { event: '*' }, (payload) => {\n         // Handle system events if needed\n      })");

content = content.replace(".subscribe();", `.subscribe((status) => {
        if (status === 'CHANNEL_ERROR' && isMounted) {
          setErrorState('Live updates unavailable. Please check your connection.');
        }
      });`);
fs.writeFileSync('src/pages/Chat.tsx', content, 'utf-8');
