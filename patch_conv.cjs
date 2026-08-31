const fs = require('fs');
const path = 'src/components/messages/ConversationCard.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = "{conversation.subscription_tier === 'pro' && <PremiumBadge />}";
const replacement = "{conversation.subscription_tier === 'pro' && <PremiumBadge planName={conversation.subscription_tier} />}";

code = code.replace(target, replacement);

fs.writeFileSync(path, code, 'utf8');
console.log("Patched ConversationCard");
