const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes("import CreatorsHub")) {
  appContent = appContent.replace(
    "import SuccessStories from './pages/SuccessStories';",
    "import SuccessStories from './pages/SuccessStories';\nimport CreatorsHub from './pages/CreatorsHub';"
  );
  
  appContent = appContent.replace(
    '<Route path="/success-stories" element={<SuccessStories />} />',
    '<Route path="/success-stories" element={<SuccessStories />} />\n              <Route path="/creators-hub" element={<CreatorsHub />} />'
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}
