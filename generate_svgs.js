import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'));

files.forEach((file, index) => {
  const name = file.replace('.jpg', '').replace(/_/g, ' ');
  const hue1 = (index * 40) % 360;
  const hue2 = (index * 40 + 60) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${hue1}, 70%, 50%);stop-opacity:1" />
        <stop offset="100%" style="stop-color:hsl(${hue2}, 70%, 50%);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#grad${index})" />
    <text x="400" y="300" font-family="sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
      ${name}
    </text>
  </svg>`;
  
  fs.writeFileSync(path.join(imagesDir, file), svg);
});
console.log('Generated ' + files.length + ' SVGs');
