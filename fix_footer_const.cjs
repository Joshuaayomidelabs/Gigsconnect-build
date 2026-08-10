const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// Remove SOCIAL_LINKS if unused
content = content.replace(/const SOCIAL_LINKS = {[\s\S]*?};\n/, '');

fs.writeFileSync('src/components/Footer.tsx', content, 'utf-8');
console.log('Fixed Footer const');
