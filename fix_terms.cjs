const fs = require('fs');

let code = fs.readFileSync('src/pages/TermsAndConditions.tsx', 'utf8');

code = code.replace(/className=\{\\\`(.*?)\\\`\}/g, "className={`$1`}");
code = code.replace(/\\\$/g, "$");

fs.writeFileSync('src/pages/TermsAndConditions.tsx', code);
