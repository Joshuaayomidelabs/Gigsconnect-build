const fs = require('fs');
let content = fs.readFileSync('src/components/PremiumBadge.tsx', 'utf-8');

const target = `      {showIcon && <CreditCard className="w-3 h-3" />}
      {planName}`;
const replacement = `      {showIcon && <CreditCard className="w-3 h-3" />}
      {planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase()}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  
  // also replace for premium
  const premiumTarget = `{showIcon && <Crown className="w-3 h-3" />}
        {planName}`;
  const premiumReplacement = `{showIcon && <Crown className="w-3 h-3" />}
        {planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase()}`;
  content = content.replace(premiumTarget, premiumReplacement);
  
  // also replace for pro
  const proTarget = `{showIcon && <Star className="w-3 h-3" />}
        {planName}`;
  const proReplacement = `{showIcon && <Star className="w-3 h-3" />}
        {planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase()}`;
  content = content.replace(proTarget, proReplacement);

  fs.writeFileSync('src/components/PremiumBadge.tsx', content, 'utf-8');
  console.log('Successfully patched PremiumBadge.tsx');
} else {
  console.log('Target string not found in PremiumBadge.tsx');
}
