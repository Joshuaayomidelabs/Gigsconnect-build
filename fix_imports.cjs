const fs = require('fs');

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Login.tsx uses Loader2, AlertCircle
  // SignUp.tsx uses Loader2, AlertCircle, Mail, Briefcase, Globe2, Sparkles (maybe?)
  // Actually, I can just replace the whole lucide-react import for Login with just Loader2, AlertCircle (and maybe Eye, EyeOff if they use PasswordInput... wait PasswordInput handles its own imports)
  
  if (filePath.includes('Login.tsx')) {
    code = code.replace(/import\s*\{\s*[^}]*\s*\}\s*from\s*'lucide-react';/, "import { Loader2, AlertCircle } from 'lucide-react';");
  } else if (filePath.includes('SignUp.tsx')) {
    code = code.replace(/import\s*\{\s*[^}]*\s*\}\s*from\s*'lucide-react';/, "import { Loader2, AlertCircle, Mail, Briefcase, Globe2, Sparkles } from 'lucide-react';");
  }

  fs.writeFileSync(filePath, code);
}

updateFile('src/pages/Login.tsx');
updateFile('src/pages/SignUp.tsx');
