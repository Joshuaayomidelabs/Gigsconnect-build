const fs = require('fs');
const path = 'src/components/PremiumBadge.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = `  // Starter / Free
  return (
    <span title="Starter Creator" className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-[#27272A] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#3F3F46] shadow-sm \${className}\`}>
      {showIcon && <CreditCard className="w-3 h-3" />}
      {planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase()}
    </span>
  );`;

const replacement = `  // Starter / Free
  if (nameLower === 'free' || nameLower === 'starter') {
    return null;
  }

  return null;`;

code = code.replace(target, replacement);

fs.writeFileSync(path, code, 'utf8');
console.log("Patched badge");
