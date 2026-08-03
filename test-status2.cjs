const fs = require('fs');
let content = fs.readFileSync('src/pages/Messages.tsx', 'utf-8');
content = content.replace(".subscribe();", `.subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          // Silent or toast? No toast needed if no error state, just let it be since they can pull to refresh
        }
      });`);
fs.writeFileSync('src/pages/Messages.tsx', content, 'utf-8');
