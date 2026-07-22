const fs = require('fs');
let content = fs.readFileSync('src/pages/Pricing.tsx', 'utf8');

content = content.replace("{\`Upgrade to \\\${plan.name}\`}", "{\`Upgrade to \${plan.name}\`}");
content = content.replace("\\`Upgrade to \\${plan.name}\\`", "\`Upgrade to \${plan.name}\`");
content = content.replace("\\`temp-\\${Date.now()}\\`", "\`temp-\${Date.now()}\`");

fs.writeFileSync('src/pages/Pricing.tsx', content);
