const fs = require('fs');
const path = 'src/pages/PublicProfile.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = '<div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 flex-wrap">';
const replacement = '<div className="flex flex-col items-center sm:flex-row sm:items-center justify-center sm:justify-start gap-2 flex-wrap">';

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(path, code, 'utf8');
    console.log("Patched container");
} else {
    console.log("Target not found");
}
