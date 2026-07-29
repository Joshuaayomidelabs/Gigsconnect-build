const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes("import AboutUs")) {
  appContent = appContent.replace(
    "import Pricing from './pages/Pricing';",
    "import Pricing from './pages/Pricing';\nimport AboutUs from './pages/AboutUs';"
  );
  
  appContent = appContent.replace(
    '<Route path="/pricing" element={<Pricing />} />',
    '<Route path="/pricing" element={<Pricing />} />\n              <Route path="/about-us" element={<AboutUs />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}
