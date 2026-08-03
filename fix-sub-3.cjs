const fs = require('fs');
let content = fs.readFileSync('src/services/subscriptionService.ts', 'utf-8');

const regex = /\/\/ If we get an RLS error[\s\S]*?throw createErr;\n\s*\}/m;
const newBlock = `      if (createErr) {
        console.error('Subscription insert error:', createErr);
        throw new Error('Unable to create your subscription at this time. Please try again later.');
      }`;

if (regex.test(content)) {
  content = content.replace(regex, newBlock);
  fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
  console.log('Successfully replaced RLS block via regex');
} else {
  console.log('Regex did not match');
}
