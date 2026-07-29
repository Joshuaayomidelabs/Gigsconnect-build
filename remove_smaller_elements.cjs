const fs = require('fs');

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  const smallerElementsRegex = /\{\/\*\s*Smaller supporting elements\s*\*\/\}[\s\S]*?<\/div>\s*<\/div>/;
  code = code.replace(smallerElementsRegex, '</div>');
  // It looks like the regex missed the closing div of the left panel because the smaller elements didn't match perfectly. Wait, no.
  // Actually, I can just remove everything from `{/* Smaller supporting elements */}` to the end of the left panel.
  // But wait, the previous regex was:
  // /\{\/\*\s*(?:Desktop )?Creator Ecosystem Collage\s*\*\/\}[\s\S]*?\{\/\*\s*Smaller supporting elements\s*\*\/\}[\s\S]*?<\/div>/
  // So it DID match until the first `</div>` after smaller supporting elements?
  // Let me just replace the remaining smaller elements.
  
  // A safe way is to find `<div className="absolute top-[0%] left-[55%]` and remove those divs.
  const badDivsRegex = /<div className="absolute top-\[.*?\] left-\[.*?\] w-12 h-12 rounded-full[\s\S]*?<\/div>/g;
  code = code.replace(badDivsRegex, '');

  fs.writeFileSync(filePath, code);
}

updateFile('src/pages/Login.tsx');
updateFile('src/pages/SignUp.tsx');

console.log("Cleaned up remaining collage icons");
