const fs = require('fs');
let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!footerContent.includes('to="/success-stories"')) {
  footerContent = footerContent.replace(
    '<li><Link to="/about-us" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">About Us</Link></li>',
    '<li><Link to="/about-us" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">About Us</Link></li>\n              <li><Link to="/success-stories" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Success Stories</Link></li>'
  );
  fs.writeFileSync('src/components/Footer.tsx', footerContent);
}
