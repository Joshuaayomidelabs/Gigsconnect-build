const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes('import ReportAbuse from')) {
  appContent = appContent.replace(
    'import AcceptableUsePolicy from \'./pages/AcceptableUsePolicy\';',
    'import AcceptableUsePolicy from \'./pages/AcceptableUsePolicy\';\nimport ReportAbuse from \'./pages/ReportAbuse\';'
  );
  
  appContent = appContent.replace(
    '<Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />',
    '<Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />\n        <Route path="/report-abuse" element={<ReportAbuse />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}

let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!footerContent.includes('to="/report-abuse"')) {
  // Add it under "Support" section alongside Help Center
  footerContent = footerContent.replace(
    '<li><Link to="/contact-support" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Contact Support</Link></li>',
    '<li><Link to="/contact-support" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Contact Support</Link></li>\n              <li><Link to="/report-abuse" className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Report Abuse</Link></li>'
  );
  
  // Make sure ShieldAlert is imported in Footer.tsx if not already
  if (!footerContent.includes('ShieldAlert')) {
     footerContent = footerContent.replace(
       'import { Link } from \'react-router-dom\';',
       'import { Link } from \'react-router-dom\';\nimport { ShieldAlert } from \'lucide-react\';'
     );
  }
  
  fs.writeFileSync('src/components/Footer.tsx', footerContent);
}
