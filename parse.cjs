const fs = require('fs');
const html = fs.readFileSync('mobbin.html', 'utf8');
const lines = html.split('\n');
lines.forEach(line => {
  if (line.includes('Linktree')) {
    console.log(line.substring(0, 1000));
  }
});
