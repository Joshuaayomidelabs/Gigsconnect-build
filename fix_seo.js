const fs = require('fs');
let content = fs.readFileSync('src/components/SEO.tsx', 'utf-8');
content = content.replace(
  "const seoTitle = title ? title === siteName ? siteName : `${title} | ${siteName}` : defaultTitle;",
  "const seoTitle = title ? title : defaultTitle;"
);
fs.writeFileSync('src/components/SEO.tsx', content, 'utf-8');
