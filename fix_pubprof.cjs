const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicProfile.tsx', 'utf8');

if (!content.includes('import { PremiumBadge }')) {
  content = content.replace("import VerificationBadge from '../components/VerificationBadge';", "import VerificationBadge from '../components/VerificationBadge';\nimport { PremiumBadge } from '../components/PremiumBadge';");
}

const targetName = `                  {profile.active_subscription && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      <CreditCard className="w-3 h-3" />
                      {profile.active_subscription.plan?.name || profile.active_subscription.plan_name}
                    </span>
                  )}`;

const newName = `                  {profile.active_subscription ? (
                    <PremiumBadge planName={profile.active_subscription.plan?.name || profile.active_subscription.plan_name} />
                  ) : (
                    <PremiumBadge planName={profile.subscription_plan || 'Starter'} />
                  )}`;

if (content.includes(targetName)) {
  content = content.replace(targetName, newName);
  fs.writeFileSync('src/pages/PublicProfile.tsx', content);
  console.log("Updated PublicProfile.tsx");
} else {
  console.log("Could not find targetName in PublicProfile.tsx");
}
