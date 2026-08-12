const fs = require('fs');
let content = fs.readFileSync('src/components/SEO.tsx', 'utf-8');
content = content.replace(/\\\$\\{title\\}/g, '${title}');
content = content.replace(/\\\$\\{siteName\\}/g, '${siteName}');
content = content.replace(/\\\`/g, '`');
fs.writeFileSync('src/components/SEO.tsx', content, 'utf-8');
console.log('Fixed SEO.tsx');
