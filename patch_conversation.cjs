const fs = require('fs');
const path = 'src/components/messages/ConversationCard.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove import
code = code.replace("import { PremiumBadge } from '../PremiumBadge';\n", '');

// 2. Remove the PremiumBadge block
const targetBlock = `            {conversation.subscription_tier === 'pro' && <PremiumBadge planName={conversation.subscription_tier} />}`;

if (code.includes(targetBlock)) {
    code = code.replace(targetBlock, '');
    fs.writeFileSync(path, code, 'utf8');
    console.log("Patched ConversationCard.tsx");
} else {
    console.log("Target block not found in ConversationCard.tsx");
}
