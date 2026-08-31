const fs = require('fs');
const path = 'src/pages/PublicProfile.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Username
code = code.replace(
  '<p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-0.5">',
  '<p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-0.5">'
);

// 2. Categories gap
code = code.replace(
  '<div className="mb-3 flex flex-wrap justify-center sm:justify-start gap-2">',
  '<div className="mb-2 flex flex-wrap justify-center sm:justify-start gap-2">'
);

// 3. Skills gap
code = code.replace(
  '<div className="mb-4 flex flex-wrap justify-center sm:justify-start gap-2">',
  '<div className="mb-3 flex flex-wrap justify-center sm:justify-start gap-2">'
);

// 4. Availability indicator
const targetAvail = `<div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Available for gigs</span>
                </div>`;
const replacementAvail = `<div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">Available for gigs</span>
                </div>`;

code = code.replace(targetAvail, replacementAvail);

fs.writeFileSync(path, code, 'utf8');
console.log("Patched Profile");
