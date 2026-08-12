const fs = require('fs');

let content = fs.readFileSync('src/services/gigsService.ts', 'utf-8');

// Add .limit(100) to getAllGigs
content = content.replace(
  ".order('created_at', { ascending: false });",
  ".order('created_at', { ascending: false })\n      .limit(100);"
);

// Add .limit(1000) to the allProfiles query just to be explicit
content = content.replace(
  ".order('verification_status', { ascending: false });",
  ".order('verification_status', { ascending: false })\n        .limit(1000);"
);

fs.writeFileSync('src/services/gigsService.ts', content, 'utf-8');
console.log('Patched gigsService.ts');
