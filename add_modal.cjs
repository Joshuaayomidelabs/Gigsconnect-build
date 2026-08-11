const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf-8');

const oldReturn = 'return (\n    <nav className={`fixed top-0';
const newReturn = 'return (\n    <>\n      <nav className={`fixed top-0';
content = content.replace(oldReturn, newReturn);

const oldEnd = '      )}\n    </nav>\n  );\n};';
const newEnd = '      )}\n    </nav>\n      <CreateHubModal \n        isOpen={isCreateModalOpen}\n        onClose={() => setIsCreateModalOpen(false)}\n      />\n    </>\n  );\n};';
content = content.replace(oldEnd, newEnd);

fs.writeFileSync('src/components/TopNav.tsx', content, 'utf-8');
console.log('Added CreateHubModal to TopNav');
