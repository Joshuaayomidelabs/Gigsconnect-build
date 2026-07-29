const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  // Fix rounded corners and padding
  code = code.replace(/rounded-\[24px\]/g, 'rounded-[20px]');
  code = code.replace(/p-8 sm:p-10/g, 'p-6 sm:p-10');
  fs.writeFileSync(file, code);
}

fixFile('src/pages/Login.tsx');
fixFile('src/pages/SignUp.tsx');
fixFile('src/pages/ForgotPassword.tsx');
fixFile('src/pages/ResetPassword.tsx');
