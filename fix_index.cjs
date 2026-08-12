const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

content = content.replace(
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">',
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">'
);

fs.writeFileSync('index.html', content, 'utf-8');
console.log('Fixed index.html preconnects');
