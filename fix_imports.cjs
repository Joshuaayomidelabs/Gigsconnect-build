const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix 'import { import { SEO } from '../components/SEO';'
    if (content.includes('import { import { SEO } from')) {
      content = content.replace(/import \{ import \{ SEO \} from '\.\.\/components\/SEO';\n?/g, '');
      content = "import { SEO } from '../components/SEO';\n" + content;
    } else if (content.includes('import { SEO } from \'../components/SEO\';')) {
      // It's already there, but let's check for malformed imports like `import {... import { SEO }`
      content = content.replace(/import (.*?)import \{ SEO \} from '\.\.\/components\/SEO';/g, "import $1\nimport { SEO } from '../components/SEO';");
    }

    // Since my previous replace might have appended it to a line without newline:
    // e.g., `import { X } from 'y';import { SEO } from '../components/SEO';`
    content = content.replace(/;import \{ SEO \}/g, ';\nimport { SEO }');
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
});
console.log('Fixed imports');
