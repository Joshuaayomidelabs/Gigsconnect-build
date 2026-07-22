const fs = require('fs');
let content = fs.readFileSync('src/components/PostCard.tsx', 'utf8');

if (!content.includes('import { PremiumBadge }')) {
  content = content.replace("import { Trash2, MessageSquare, Heart, Shield, Copy, Check, BadgeCheck, FileText, Image as ImageIcon, Video, Music, Play, X, ExternalLink, RefreshCw } from 'lucide-react';", "import { Trash2, MessageSquare, Heart, Shield, Copy, Check, BadgeCheck, FileText, Image as ImageIcon, Video, Music, Play, X, ExternalLink, RefreshCw } from 'lucide-react';\nimport { PremiumBadge } from './PremiumBadge';");
}

if (!content.includes('subscription_plan?: string;')) {
  content = content.replace('verification_status?: string;', 'verification_status?: string;\n      subscription_plan?: string;');
}

const targetName = `              {post.user?.verification_status?.toLowerCase() === 'verified' && (
                <BadgeCheck className="w-3.5 h-3.5 text-brand-purple" />
              )}`;

const newName = `              {post.user?.verification_status?.toLowerCase() === 'verified' && (
                <BadgeCheck className="w-3.5 h-3.5 text-brand-purple" />
              )}
              {post.user?.subscription_plan && post.user?.subscription_plan !== 'starter' && (
                <PremiumBadge planName={post.user.subscription_plan} className="scale-75 origin-left" />
              )}`;

if (content.includes(targetName)) {
  content = content.replace(targetName, newName);
}

const targetComment = `                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-[13px] text-gray-900 dark:text-white cursor-pointer hover:underline" onClick={() => navigate(\`/profile/\${c.user_id}\`)}>
                        {c.user?.full_name || 'Anonymous User'}
                      </span>
                      {c.user?.verification_status?.toLowerCase() === 'verified' && (
                        <BadgeCheck className="w-3.5 h-3.5 text-brand-purple" />
                      )}
                    </div>`;

const newComment = `                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-[13px] text-gray-900 dark:text-white cursor-pointer hover:underline" onClick={() => navigate(\`/profile/\${c.user_id}\`)}>
                        {c.user?.full_name || 'Anonymous User'}
                      </span>
                      {c.user?.verification_status?.toLowerCase() === 'verified' && (
                        <BadgeCheck className="w-3.5 h-3.5 text-brand-purple" />
                      )}
                      {c.user?.subscription_plan && c.user?.subscription_plan !== 'starter' && (
                        <PremiumBadge planName={c.user.subscription_plan} className="scale-75 origin-left" />
                      )}
                    </div>`;

if (content.includes(targetComment)) {
  content = content.replace(targetComment, newComment);
}

fs.writeFileSync('src/components/PostCard.tsx', content);
