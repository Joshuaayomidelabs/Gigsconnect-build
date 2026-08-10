const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
const importTarget = `import Settings from './pages/Settings';`;
const importReplacement = `import Settings from './pages/Settings';\nimport Blog from './pages/Blog';\nimport BlogPost from './pages/BlogPost';`;
if (content.includes(importTarget)) {
  content = content.replace(importTarget, importReplacement);
}

// Add route
const routeTarget = `<Route path="/about-us" element={<AboutUs />} />`;
const routeReplacement = `<Route path="/about-us" element={<AboutUs />} />\n              <Route path="/blog" element={<Blog />} />\n              <Route path="/blog/:slug" element={<BlogPost />} />`;
if (content.includes(routeTarget)) {
  content = content.replace(routeTarget, routeReplacement);
  fs.writeFileSync('src/App.tsx', content, 'utf-8');
  console.log('Successfully patched App.tsx');
} else {
  console.log('Target string not found in App.tsx');
}
