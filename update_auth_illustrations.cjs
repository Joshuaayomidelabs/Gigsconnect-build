const fs = require('fs');

function updateFile(filePath, illustrationName, title, subtitle) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  const collageRegex = /\{\/\*\s*(?:Desktop )?Creator Ecosystem Collage\s*\*\/\}[\s\S]*?\{\/\*\s*Smaller supporting elements\s*\*\/\}[\s\S]*?<\/div>/;
  const newIllustration = `{/* Desktop Illustration */}
          <div className="flex-1 relative w-full hidden md:flex items-center justify-center min-h-[460px] mt-2">
            <div className="absolute inset-0 bg-brand-purple/5 rounded-[2rem] transform rotate-3"></div>
            <img src="/assets/illustrations/creators/${illustrationName}" alt="${title}" className="w-full h-full max-w-[400px] object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          </div>`;
  
  if (collageRegex.test(code)) {
    code = code.replace(collageRegex, newIllustration);
  } else {
    // maybe try simpler regex if it fails
    const fallbackRegex = /\{\/\*\s*(?:Desktop )?Creator Ecosystem Collage\s*\*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    if (fallbackRegex.test(code)) {
      code = code.replace(fallbackRegex, newIllustration + '\n        </div>\n      </div>');
    }
  }

  // Also replace some left-panel text if it matches? No, keep it as is, just the illustration.
  fs.writeFileSync(filePath, code);
}

updateFile('src/pages/Login.tsx', 'photographer.svg', 'Photographer', 'Welcome Back');
updateFile('src/pages/SignUp.tsx', 'web-creator.svg', 'Creator', 'Join GigsConnect');

console.log("Updated auth illustrations");
