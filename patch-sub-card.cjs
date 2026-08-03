const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionCard.tsx', 'utf-8');

const target = `const planName = subscription?.plan?.name || subscription?.plan_name || 'Starter';`;
const replacement = `const rawPlanName = subscription?.plan?.name || subscription?.plan_name || 'Starter';
  const planName = rawPlanName.charAt(0).toUpperCase() + rawPlanName.slice(1).toLowerCase();`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/SubscriptionCard.tsx', content, 'utf-8');
  console.log('Successfully patched SubscriptionCard.tsx');
} else {
  console.log('Target string not found in SubscriptionCard.tsx');
}
