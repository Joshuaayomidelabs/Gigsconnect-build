const fs = require('fs');
const content = fs.readFileSync('src/pages/EditProfile.tsx', 'utf8');
const target = `                    <h2 className="text-3xl font-black text-brand-black dark:text-brand-white tracking-tight">
                      {formData.full_name || 'Anonymous User'}
                    </h2>`;
const replacement = `                    <h2 className="text-3xl font-black text-brand-black dark:text-brand-white tracking-tight flex items-center gap-3">
                      {formData.full_name || 'Anonymous User'}
                      {formData.verification_status === 'verified' && (
                        <span title="Verified Creator" className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full p-1 shadow-sm">
                          <CheckCircle2 className="w-5 h-5" />
                        </span>
                      )}
                    </h2>`;
if (content.includes(target)) {
  fs.writeFileSync('src/pages/EditProfile.tsx', content.replace(target, replacement));
  console.log('Success');
} else {
  console.log('Target not found');
}
