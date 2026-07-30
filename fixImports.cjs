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

  let importsToAdd = [];
  if (content.includes('getFriendlyErrorMessage') && !content.match(/import\s+{[^}]*getFriendlyErrorMessage[^}]*}\s+from\s+['"].*\/utils\/errorHandler['"]/)) {
      importsToAdd.push('getFriendlyErrorMessage');
  }
  if (content.includes('handleError') && !content.match(/import\s+{[^}]*handleError[^}]*}\s+from\s+['"].*\/utils\/errorHandler['"]/)) {
      importsToAdd.push('handleError');
  }

  // Also fix ProfileCard err issue: `handleError(err, "Operation Error");` where it should be `handleError(error, ...)`
  content = content.replace(/handleError\(err,\s*"Operation Error"\);/g, (match, offset, fullText) => {
      // Find what the catch block is using
      const nearbyCatch = fullText.substring(Math.max(0, offset - 500), offset).match(/catch\s*\(\s*(error|err|e)/);
      if (nearbyCatch && nearbyCatch[1] !== 'err') {
          return `handleError(${nearbyCatch[1]}, "Operation Error");`;
      }
      return match;
  });

  if (importsToAdd.length > 0) {
        const importLevel = file.split(path.sep).length - 2;
        let importPath = '';
        if (importLevel === 0) importPath = './utils/errorHandler';
        else if (importLevel === 1) importPath = '../utils/errorHandler';
        else if (importLevel === 2) importPath = '../../utils/errorHandler';
        else if (importLevel === 3) importPath = '../../../utils/errorHandler';
        
        // If there's an existing import for errorHandler, just add to it, but it's simpler to just add a new one.
        const importStatement = `\nimport { ${importsToAdd.join(', ')} } from '${importPath}';`;
        const importMatches = [...content.matchAll(/^import .* from .*$/gm)];
        if (importMatches.length > 0) {
            const lastImportMatch = importMatches[importMatches.length - 1];
            const lastImportIndex = lastImportMatch.index + lastImportMatch[0].length;
            content = content.slice(0, lastImportIndex) + importStatement + content.slice(lastImportIndex);
        } else {
            content = importStatement + '\n' + content;
        }
  }
  if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
  }
});
