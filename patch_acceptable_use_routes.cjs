const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes('import AcceptableUsePolicy from')) {
  appContent = appContent.replace(
    'import CopyrightPolicy from \'./pages/CopyrightPolicy\';',
    'import CopyrightPolicy from \'./pages/CopyrightPolicy\';\nimport AcceptableUsePolicy from \'./pages/AcceptableUsePolicy\';'
  );
  
  appContent = appContent.replace(
    '<Route path="/copyright-policy" element={<CopyrightPolicy />} />',
    '<Route path="/copyright-policy" element={<CopyrightPolicy />} />\n        <Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}

let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!footerContent.includes('to="/acceptable-use-policy"')) {
  footerContent = footerContent.replace(
    '<li><Link to="/copyright-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Copyright Policy</Link></li>',
    '<li><Link to="/copyright-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Copyright Policy</Link></li>\n              <li><Link to="/acceptable-use-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Acceptable Use Policy</Link></li>'
  );
  fs.writeFileSync('src/components/Footer.tsx', footerContent);
}
