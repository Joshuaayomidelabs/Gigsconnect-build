const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  if (file.includes('errorHandler.ts')) return;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Add import if needed
  let needsImport = false;

  // Replace toast.error(err.message, ...) with handleError(err, "Context")
  // First, find places where err.message or error.message is used in toast.error
  const errorMsgRegex = /toast\.error\(\s*(error|err|e|appError)\.message(\s*\|\|\s*['"][^'"]+['"])?\s*(,\s*\{[^}]+\})?\s*\)/g;
  content = content.replace(errorMsgRegex, (match, errName, fallback, options) => {
    needsImport = true;
    return `handleError(${errName}, "Operation Error")`;
  });
  
  const errorMsgRegex2 = /toast\.error\(\s*['"][^'"]+['"]\s*\+\s*(error|err|e|appError)\.message\s*(,\s*\{[^}]+\})?\s*\)/g;
  content = content.replace(errorMsgRegex2, (match, errName, options) => {
    needsImport = true;
    return `handleError(${errName}, "Operation Error")`;
  });
  
  const errorMsgRegex3 = /toast\.error\(\s*(error|err|e|appError)\s*(,\s*\{[^}]+\})?\s*\)/g;
  content = content.replace(errorMsgRegex3, (match, errName, options) => {
    needsImport = true;
    return `handleError(${errName}, "Operation Error")`;
  });

  const notifyRegex = /toast\.error\(\s*(['"][^'"]+['"])\s*(,\s*\{[^}]+\})?\s*\)/g;
  content = content.replace(notifyRegex, (match, message, options) => {
    needsImport = true;
    return `notifyError(${message})`;
  });
  
  const consoleLogRegex = /console\.log\(\s*(error|err|e)\s*\)/g;
  content = content.replace(consoleLogRegex, (match, errName) => {
    return `console.error('[Error]', ${errName})`;
  });

  // Handle alert(error.message)
  const alertRegex = /alert\(\s*(error|err|e)\.message\s*\)/g;
  content = content.replace(alertRegex, (match, errName) => {
    needsImport = true;
    return `handleError(${errName}, "Alert Error")`;
  });

  if (needsImport && content !== originalContent) {
    // Add import statement at the top if it doesn't exist
    if (!content.includes("from '../utils/errorHandler'") && !content.includes("from '../../utils/errorHandler'") && !content.includes("from 'src/utils/errorHandler'")) {
        const importLevel = file.split(path.sep).length - 2;
        const importPath = importLevel === 0 ? './utils/errorHandler' : 
                          importLevel === 1 ? '../utils/errorHandler' : 
                          importLevel === 2 ? '../../utils/errorHandler' : 
                          '../../../utils/errorHandler';
        
        let imports = [];
        if (content.includes('handleError')) imports.push('handleError');
        if (content.includes('notifyError')) imports.push('notifyError');
        
        if (imports.length > 0) {
            const importStatement = `\nimport { ${imports.join(', ')} } from '${importPath}';`;
            
            // Find last import
            const importMatches = [...content.matchAll(/^import .* from .*$/gm)];
            if (importMatches.length > 0) {
                const lastImportMatch = importMatches[importMatches.length - 1];
                const lastImportIndex = lastImportMatch.index + lastImportMatch[0].length;
                content = content.slice(0, lastImportIndex) + importStatement + content.slice(lastImportIndex);
            } else {
                content = importStatement + '\n' + content;
            }
        }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
