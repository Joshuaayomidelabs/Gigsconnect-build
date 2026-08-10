const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove duplicate imports
content = content.replace("import Blog from './pages/Blog';\nimport BlogPost from './pages/BlogPost';\nimport Blog from './pages/Blog';\nimport BlogPost from './pages/BlogPost';", "import Blog from './pages/Blog';\nimport BlogPost from './pages/BlogPost';");

// Remove duplicate routes if exist
const targetRoute = `<Route path="/blog" element={<Blog />} />\n              <Route path="/blog/:slug" element={<BlogPost />} />\n              <Route path="/blog" element={<Blog />} />\n              <Route path="/blog/:slug" element={<BlogPost />} />`;
const replacementRoute = `<Route path="/blog" element={<Blog />} />\n              <Route path="/blog/:slug" element={<BlogPost />} />`;
content = content.replace(targetRoute, replacementRoute);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Fixed app');
