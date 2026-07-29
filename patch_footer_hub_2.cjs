const fs = require('fs');
let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!footerContent.includes('to="/creators-hub"')) {
  footerContent = footerContent.replace(
    '<li><Link to="/success-stories" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Success Stories</Link></li>',
    '<li><Link to="/success-stories" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Success Stories</Link></li>\n              <li><Link to="/creators-hub" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Creators Hub</Link></li>'
  );
  fs.writeFileSync('src/components/Footer.tsx', footerContent);
}
