const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove injected messy imports
    content = content.replace(/import\s*\{\s*import\s*\{\s*SEO\s*\}\s*from\s*'[^']+'\s*;\s*/g, '');
    content = content.replace(/import\s*\{\s*SEO\s*\}\s*from\s*'[^']+'\s*;/g, '');
    
    // Add clean import at the very top
    if (content.includes('<SEO ')) {
      content = "import { SEO } from '../components/SEO';\n" + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
});
console.log('Cleaned up imports');
