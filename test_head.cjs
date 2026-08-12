const fs = require('fs');
console.log(fs.readFileSync('src/pages/AboutUs.tsx', 'utf8').substring(0, 300));
