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
  let needsImport = false;

  const setErrRegex = /(setError|setSupabaseError|setGlobalError|setAuthError)\(\s*(error|err|e)\.message(\s*\|\|\s*['"][^'"]+['"])?\s*\)/g;
  content = content.replace(setErrRegex, (match, fnName, errName) => {
    needsImport = true;
    return `${fnName}(getFriendlyErrorMessage(${errName}))`;
  });

  if (needsImport && content !== originalContent) {
    if (!content.includes("getFriendlyErrorMessage")) {
        const importLevel = file.split(path.sep).length - 2;
        let importPath = '';
        if (importLevel === 0) importPath = './utils/errorHandler';
        else if (importLevel === 1) importPath = '../utils/errorHandler';
        else if (importLevel === 2) importPath = '../../utils/errorHandler';
        else if (importLevel === 3) importPath = '../../../utils/errorHandler';
        
        const importStatement = `\nimport { getFriendlyErrorMessage } from '${importPath}';`;
        const importMatches = [...content.matchAll(/^import .* from .*$/gm)];
        if (importMatches.length > 0) {
            const lastImportMatch = importMatches[importMatches.length - 1];
            const lastImportIndex = lastImportMatch.index + lastImportMatch[0].length;
            content = content.slice(0, lastImportIndex) + importStatement + content.slice(lastImportIndex);
        } else {
            content = importStatement + '\n' + content;
        }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
