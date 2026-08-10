const fs = require('fs');
let content = fs.readFileSync('src/pages/AboutUs.tsx', 'utf-8');

const replacementConst = `const TEAM_SOCIALS = {
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com'
};

const AboutUs: React.FC = () => {`;

content = content.replace('const AboutUs: React.FC = () => {', replacementConst);
fs.writeFileSync('src/pages/AboutUs.tsx', content, 'utf-8');
console.log('Fixed about');
