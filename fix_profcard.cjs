const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileCard.tsx', 'utf8');

if (!content.includes('import { PremiumBadge }')) {
  content = content.replace("import { Heart, MessageSquare, MapPin, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';", "import { Heart, MessageSquare, MapPin, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';\nimport { PremiumBadge } from './PremiumBadge';");
}

const targetName = `        <h3 className="text-xl font-black text-brand-black dark:text-brand-white leading-tight mb-1 truncate px-2">
          {localProfile.full_name || 'Anonymous User'}
        </h3>`;

const newName = `        <h3 className="text-xl font-black text-brand-black dark:text-brand-white leading-tight mb-1 truncate px-2 flex items-center justify-center gap-1">
          <span className="truncate">{localProfile.full_name || 'Anonymous User'}</span>
          {(localProfile.subscription_plan && localProfile.subscription_plan !== 'starter') && (
            <PremiumBadge planName={localProfile.subscription_plan} className="scale-75 origin-left" />
          )}
        </h3>`;

if (content.includes(targetName)) {
  content = content.replace(targetName, newName);
  fs.writeFileSync('src/components/ProfileCard.tsx', content);
  console.log("Updated ProfileCard.tsx");
} else {
  console.log("Target not found");
}
