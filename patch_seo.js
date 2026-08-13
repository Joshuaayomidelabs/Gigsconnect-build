const fs = require('fs');

let content = fs.readFileSync('src/components/SEO.tsx', 'utf-8');

// Replace \${title} with ${title}
content = content.replace(/\\?\$\{(.*?)\}/g, '$$$$1'); // Wait, replace with template strings is tricky using sed/js

// Let's just do it directly.
