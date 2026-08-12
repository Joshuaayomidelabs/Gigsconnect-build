const fs = require('fs');

let blog = fs.readFileSync('src/pages/Blog.tsx', 'utf-8');
blog = blog.replace(/Search, import \{ ArrowRight/, 'import { Search, ArrowRight');
fs.writeFileSync('src/pages/Blog.tsx', blog, 'utf-8');

let help = fs.readFileSync('src/pages/HelpCenter.tsx', 'utf-8');
help = help.replace(/Search, ChevronDown/, 'import { Search, ChevronDown');
help = help.replace(/import \{ ArrowRight,/, 'ArrowRight,');
fs.writeFileSync('src/pages/HelpCenter.tsx', help, 'utf-8');

let landing = fs.readFileSync('src/pages/Landing.tsx', 'utf-8');
landing = landing.replace(/CheckCircle, Zap/, 'import { CheckCircle, Zap');
landing = landing.replace(/import \{ ArrowRight,/, 'ArrowRight,');
fs.writeFileSync('src/pages/Landing.tsx', landing, 'utf-8');

let report = fs.readFileSync('src/pages/ReportAbuse.tsx', 'utf-8');
report = report.replace(/ShieldAlert,/, 'import { ShieldAlert,');
fs.writeFileSync('src/pages/ReportAbuse.tsx', report, 'utf-8');

console.log('Fixed remaining imports');
