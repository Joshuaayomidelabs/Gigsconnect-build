const fs = require('fs');
const filesToFix = ['AboutUs.tsx', 'Blog.tsx', 'CreatorCategories.tsx', 'HelpCenter.tsx', 'Landing.tsx', 'ReportAbuse.tsx'];

filesToFix.forEach(file => {
  let content = fs.readFileSync('src/pages/' + file, 'utf-8');
  // Fix lucide-react import
  content = content.replace(/import\s*\{\s*SEO\s*\}\s*from\s*'[^']+'\s*;\s*ArrowRight/g, 'import { ArrowRight');
  
  if (file === 'CreatorCategories.tsx') {
    content = content.replace(/<SEO title="Categories \| GigsConnect" noindex=\{true\} \/>/g, '');
    // Need to correctly inject it
    const mainReturn = 'return (\n    <div className="pt-main min-h-screen bg-brand-white dark:bg-brand-black pb-24 px-4 sm:px-6">';
    if (content.includes(mainReturn)) {
      content = content.replace(mainReturn, mainReturn + '\n      <SEO title="Categories | GigsConnect" noindex={true} />');
    }
  }

  // Remove duplicate SEO imports
  const seoImport = "import { SEO } from '../components/SEO';\n";
  let importCount = (content.match(/import \{ SEO \} from '\.\.\/components\/SEO';/g) || []).length;
  if (importCount > 1) {
    content = content.replace(/import \{ SEO \} from '\.\.\/components\/SEO';\n?/g, '');
    content = seoImport + content;
  }
  
  fs.writeFileSync('src/pages/' + file, content, 'utf-8');
});
console.log('Fixed components');
