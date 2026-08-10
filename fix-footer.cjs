const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

const replacementConst = `const SOCIAL_LINKS = {
  twitter: 'https://twitter.com', 
  instagram: 'https://instagram.com', 
  linkedin: 'https://linkedin.com', 
  facebook: 'https://facebook.com', 
};

const Footer: React.FC = () => {`;

content = content.replace('const Footer: React.FC = () => {', replacementConst);
fs.writeFileSync('src/components/Footer.tsx', content, 'utf-8');
console.log('Fixed footer');
