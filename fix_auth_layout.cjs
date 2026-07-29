const fs = require('fs');

function updateFile(filePath, illustrationName, title) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Find where the collage starts and the left panel ends.
  // Both have:
  // {/* Branding Header */} ... </div>
  // {/* Desktop ... */}
  // <div className="flex-1 relative w-full hidden md:block min-h-[460px] mt-2">
  
  const searchStart = '{/* Branding Header */}';
  let startIndex = code.indexOf(searchStart);
  if (startIndex === -1) return;
  
  // Find the end of the Branding Header
  const endOfBrandingHeader = code.indexOf('</div>', startIndex) + 6;
  
  const leftPanelEndRegex = /\s*<\/\s*div>\s*\{\/\*\s*RIGHT PANEL/g;
  let match = leftPanelEndRegex.exec(code);
  let leftPanelEnd = match ? match.index : -1;
  
  if (leftPanelEnd !== -1 && endOfBrandingHeader !== -1) {
    const before = code.substring(0, endOfBrandingHeader);
    const after = code.substring(leftPanelEnd);
    
    const newMiddle = `\n
          {/* Desktop Illustration */}
          <div className="flex-1 relative w-full hidden md:flex items-center justify-center min-h-[460px] mt-2 pb-16">
            <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-[2rem] transform rotate-3"></div>
            <img src="/assets/illustrations/creators/${illustrationName}" alt="${title}" className="w-full h-full max-w-[400px] object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          </div>
          
          {/* Mobile Swipeable Gallery */}
          <div className="mt-8 flex md:hidden overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
             {/* Simple mobile placeholder if needed, or just hidden illustration */}
          </div>
`;
    code = before + newMiddle + after;
    fs.writeFileSync(filePath, code);
  }
}

updateFile('src/pages/Login.tsx', 'photographer.svg', 'Photographer');
updateFile('src/pages/SignUp.tsx', 'web-creator.svg', 'Creator');

console.log("Auth layouts fixed");
