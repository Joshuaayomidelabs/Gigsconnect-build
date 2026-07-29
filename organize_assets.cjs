const fs = require('fs');
const path = require('path');

const fileMap = {
  // creators
  'dj-bro.svg': 'illustrations/creators',
  'media.svg': 'illustrations/creators',
  'content-creator.svg': 'illustrations/creators',
  'photographer.svg': 'illustrations/creators',
  'music.svg': 'illustrations/creators',
  'design.svg': 'illustrations/landing',
  'makeup.svg': 'illustrations/creators',
  'web-creator.svg': 'illustrations/creators',
  'dj-rafiki.svg': 'illustrations/creators',
  'freelancer.svg': 'illustrations/creators',
  'profile.svg': 'illustrations/landing',
  
  // landing
  'chat-pana.svg': 'illustrations/landing',
  'analytics.svg': 'illustrations/landing',
  'networking.svg': 'illustrations/landing',
  'press-play.svg': 'illustrations/landing',
  'chat.svg': 'illustrations/landing',
  'teamwork.svg': 'illustrations/landing',
  'leader.svg': 'illustrations/landing',
  'calendar.svg': 'illustrations/landing',

  // empty_states
  'notifications-alt.svg': 'illustrations/empty_states',
  'notifications.svg': 'illustrations/empty_states',

  // onboarding
  'celebration.svg': 'illustrations/onboarding',
};

// move images
for (const [file, folder] of Object.entries(fileMap)) {
  const src = path.join('public/images', file);
  const dest = path.join('public/assets', folder, file);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
  }
}

// move logo and favicon
if (fs.existsSync('public/logo.svg')) fs.renameSync('public/logo.svg', 'public/assets/branding/logo.svg');
if (fs.existsSync('public/favicon.svg')) fs.renameSync('public/favicon.svg', 'public/assets/branding/favicon.svg');

// Update source code references
function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [search, replace] of replacements) {
    content = content.replaceAll(search, replace);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content);
  }
}

const landingReplacements = Object.entries(fileMap).map(([file, folder]) => [
  `/images/${file}`,
  `/assets/${folder}/${file}`
]);

replaceInFile('src/pages/Landing.tsx', landingReplacements);
// we also saw logo in src/utils/constants.ts
replaceInFile('src/utils/constants.ts', [
  ['/logo.svg', '/assets/branding/logo.svg']
]);
// favicon in index.html
replaceInFile('index.html', [
  ['/favicon.svg', '/assets/branding/favicon.svg']
]);

console.log("Done");
