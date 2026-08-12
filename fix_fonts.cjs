const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf-8');
indexHtml = indexHtml.replace(
  'family=Inter:wght@400;500;600;700;800;900&display=swap',
  'family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap'
);
fs.writeFileSync('index.html', indexHtml, 'utf-8');

let indexCss = fs.readFileSync('src/index.css', 'utf-8');
indexCss = indexCss.replace(
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');\n",
  ""
);
fs.writeFileSync('src/index.css', indexCss, 'utf-8');

console.log('Fixed fonts loading waterfall');
