const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.sql'));
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('CREATE OR REPLACE FUNCTION')) {
    console.log(`\n--- ${f} ---`);
    const lines = content.split('\n');
    lines.forEach(l => { if (l.includes('FUNCTION')) console.log(l); });
  }
}
