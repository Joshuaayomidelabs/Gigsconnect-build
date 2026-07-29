const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes('import Blog from')) {
  appContent = appContent.replace(
    'import Settings from \'./pages/Settings\';',
    'import Settings from \'./pages/Settings\';\nimport Blog from \'./pages/Blog\';\nimport BlogPost from \'./pages/BlogPost\';'
  );
  
  appContent = appContent.replace(
    '<Route path="/settings" element={<Settings />} />',
    '<Route path="/settings" element={<Settings />} />\n        <Route path="/blog" element={<Blog />} />\n        <Route path="/blog/:slug" element={<BlogPost />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}

let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!footerContent.includes('to="/blog"')) {
  footerContent = footerContent.replace(
    '<li><Link to="/about-us" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">About Us</Link></li>',
    '<li><Link to="/about-us" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">About Us</Link></li>\n              <li><Link to="/blog" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Blog</Link></li>'
  );
  fs.writeFileSync('src/components/Footer.tsx', footerContent);
}
