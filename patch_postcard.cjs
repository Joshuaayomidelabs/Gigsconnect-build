const fs = require('fs');
const path = 'src/components/PostCard.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove import
code = code.replace("import { PremiumBadge } from './PremiumBadge';\n", '');

// 2. Remove the PremiumBadge block
const targetBlock = `              {post.user?.subscription_plan && post.user?.subscription_plan !== 'starter' && (
                <PremiumBadge planName={post.user.subscription_plan} className="scale-75 origin-left" />
              )}`;

if (code.includes(targetBlock)) {
    code = code.replace(targetBlock, '');
    fs.writeFileSync(path, code, 'utf8');
    console.log("Patched PostCard.tsx");
} else {
    console.log("Target block not found in PostCard.tsx");
}
