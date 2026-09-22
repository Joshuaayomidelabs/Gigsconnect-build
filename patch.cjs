const fs = require('fs');
const code = fs.readFileSync('src/pages/PublicProfile.tsx', 'utf8');

const startStr = '<div id="profile-card" className="bg-white dark:bg-brand-dark-card rounded-[2.25rem] shadow-xl border border-gray-100 dark:border-[#1F1F23]/80 p-6 sm:p-10 mb-8 relative">';
const startIndex = code.indexOf(startStr);

if (startIndex === -1) {
  console.log("Start not found");
  process.exit(1);
}

const endStr = '        {isOwnProfile && <ProfileCompletionWidget';
const endIndex = code.indexOf(endStr, startIndex);

if (endIndex === -1) {
  console.log("End not found");
  process.exit(1);
}

const replacement = fs.readFileSync('new_header.tsx', 'utf8');

const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);

fs.writeFileSync('src/pages/PublicProfile.tsx', newCode, 'utf8');
console.log("Patched");
