const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes("import SuccessStories")) {
  appContent = appContent.replace(
    "import AboutUs from './pages/AboutUs';",
    "import AboutUs from './pages/AboutUs';\nimport SuccessStories from './pages/SuccessStories';"
  );
  
  appContent = appContent.replace(
    '<Route path="/about-us" element={<AboutUs />} />',
    '<Route path="/about-us" element={<AboutUs />} />\n              <Route path="/success-stories" element={<SuccessStories />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}
