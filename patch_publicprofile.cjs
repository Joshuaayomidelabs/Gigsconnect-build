const fs = require('fs');
const path = 'src/pages/PublicProfile.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove import
code = code.replace("import { PremiumBadge } from '../components/PremiumBadge';\n", '');

// 2. Remove the duplicate verification badge and the premium badge
const targetBlock = `                  {profile.verification_status === 'verified' && (
                    <span title="Verified Creator" className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full p-1 shadow-sm shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                  {profile.active_subscription ? (
                    <PremiumBadge planName={profile.active_subscription.plan?.name || profile.active_subscription.plan_name} />
                  ) : (
                    <PremiumBadge planName={profile.subscription_plan || 'Starter'} />
                  )}`;

if (code.includes(targetBlock)) {
    code = code.replace(targetBlock, '');
    fs.writeFileSync(path, code, 'utf8');
    console.log("Patched PublicProfile.tsx");
} else {
    console.log("Target block not found in PublicProfile.tsx");
}
