const fs = require('fs');
const code = fs.readFileSync('src/pages/PublicProfile.tsx', 'utf8');

const startIndex = code.indexOf('<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">');
if (startIndex === -1) {
  console.log("Start not found");
  process.exit(1);
}

const actionButtonsStr = '<div className="flex flex-col sm:flex-row gap-3">';
const endIndex = code.indexOf(actionButtonsStr, startIndex);
if (endIndex === -1) {
  console.log("Action buttons not found");
  process.exit(1);
}
// Find the end of the action buttons container. It's a bit hard, let's just replace from startIndex up to the end of the profile-card div.
