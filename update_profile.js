const fs = require('fs');
const content = fs.readFileSync('src/pages/PublicProfile.tsx', 'utf8');
const target = `                <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight leading-tight truncate flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
                  {profile.full_name || 'Anonymous Creator'}
                </h1>`;
const replacement = `                <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight leading-tight truncate flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
                  {profile.full_name || 'Anonymous Creator'}
                  {profile.verification_status === 'verified' && (
                    <span title="Verified Creator" className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full p-1 shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                  {profile.active_subscription && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      <CreditCard className="w-4 h-4" />
                      {profile.active_subscription.plan?.name || profile.active_subscription.plan_name}
                    </span>
                  )}
                </h1>`;
if (content.includes(target)) {
  fs.writeFileSync('src/pages/PublicProfile.tsx', content.replace(target, replacement));
  console.log('Success');
} else {
  console.log('Target not found');
}
