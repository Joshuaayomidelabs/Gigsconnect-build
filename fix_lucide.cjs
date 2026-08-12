const fs = require('fs');
const filesToFix = ['AboutUs.tsx', 'Blog.tsx', 'HelpCenter.tsx', 'Landing.tsx', 'ReportAbuse.tsx'];

filesToFix.forEach(file => {
  let content = fs.readFileSync('src/pages/' + file, 'utf-8');
  if (content.match(/ArrowRight/)) {
    content = content.replace(/ArrowRight,/, 'import { ArrowRight,');
  }
  fs.writeFileSync('src/pages/' + file, content, 'utf-8');
});
console.log('Fixed lucide imports');
