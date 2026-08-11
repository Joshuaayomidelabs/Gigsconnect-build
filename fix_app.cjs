const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace("pb-\\[calc(4rem+env(safe-area-inset-bottom))\\]", "pb-[calc(4rem+env(safe-area-inset-bottom))]");
fs.writeFileSync('src/App.tsx', content, 'utf-8');
