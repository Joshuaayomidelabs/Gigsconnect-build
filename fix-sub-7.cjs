const fs = require('fs');
let content = fs.readFileSync('src/services/subscriptionService.ts', 'utf-8');

const oldLine = `plan_name: 'pro', // Bypass legacy check constraint "subscriptions_plan_name_check" which strictly accepts only 'pro' or 'premium'`;
const newLine = `plan_name: starterPlan.name,`;

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
  console.log('Successfully replaced plan_name workaround');
} else {
  console.log('Could not find oldLine');
}
