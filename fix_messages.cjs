const fs = require('fs');
let content = fs.readFileSync('src/services/messagesService.ts', 'utf-8');
content = content.replace(
  /other_user_id: otherUserId/g,
  'other_user: otherUserId'
);
fs.writeFileSync('src/services/messagesService.ts', content, 'utf-8');
console.log('Fixed parameter name in messagesService.ts');
