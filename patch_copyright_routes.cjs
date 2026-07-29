const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes('import CopyrightPolicy from')) {
  appContent = appContent.replace(
    'import CookiePolicy from \'./pages/CookiePolicy\';',
    'import CookiePolicy from \'./pages/CookiePolicy\';\nimport CopyrightPolicy from \'./pages/CopyrightPolicy\';'
  );
  
  appContent = appContent.replace(
    '<Route path="/cookie-policy" element={<CookiePolicy />} />',
    '<Route path="/cookie-policy" element={<CookiePolicy />} />\n        <Route path="/copyright-policy" element={<CopyrightPolicy />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}

let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!footerContent.includes('to="/copyright-policy"')) {
  footerContent = footerContent.replace(
    '<li><Link to="/cookie-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Cookie Policy</Link></li>',
    '<li><Link to="/cookie-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Cookie Policy</Link></li>\n              <li><Link to="/copyright-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Copyright Policy</Link></li>'
  );
  fs.writeFileSync('src/components/Footer.tsx', footerContent);
}
