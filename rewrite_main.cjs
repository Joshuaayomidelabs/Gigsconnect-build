const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');

if (!content.includes('HelmetProvider')) {
  content = content.replace(
    "import { BrowserRouter } from 'react-router-dom';",
    "import { BrowserRouter } from 'react-router-dom';\nimport { HelmetProvider } from 'react-helmet-async';"
  );
  
  content = content.replace(
    "<BrowserRouter>",
    "<HelmetProvider>\n      <BrowserRouter>"
  );
  
  content = content.replace(
    "</BrowserRouter>",
    "</BrowserRouter>\n    </HelmetProvider>"
  );
  
  fs.writeFileSync('src/main.tsx', content, 'utf-8');
  console.log('Added HelmetProvider to main.tsx');
}
