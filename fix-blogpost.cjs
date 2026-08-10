const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf-8');

content = content.replace(/href="#"/g, 'href="#content"');
fs.writeFileSync('src/pages/BlogPost.tsx', content, 'utf-8');
console.log('Fixed BlogPost');
