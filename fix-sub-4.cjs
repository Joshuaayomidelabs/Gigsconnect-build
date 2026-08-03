const fs = require('fs');
let content = fs.readFileSync('src/services/subscriptionService.ts', 'utf-8');

const oldLog = `console.log('Inserting Starter subscription for:', actualUserId);`;
const newLog = `console.log(\`[Subscription Flow] Verified Authenticated User ID: \${actualUserId}. Attempting to insert Starter subscription.\`);`;

content = content.replace(oldLog, newLog);
fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
