const fs = require('fs');

function updatePasswordInput() {
  const filePath = 'src/components/PasswordInput.tsx';
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Replace label style
  code = code.replace(/text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1/g, "text-sm font-medium text-gray-700 mb-2");
  
  // Replace input style
  // Old: `block w-full h-[56px] rounded-[18px] border-0 pl-5 pr-12 text-base text-[#111827] shadow-sm ring-1 ring-inset ${...} placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white focus:bg-white`
  // New: `block w-full h-[56px] rounded-xl border-0 pl-4 pr-12 text-base text-[#111827] shadow-sm ring-1 ring-inset ${...} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all duration-200 bg-white`
  
  code = code.replace(/h-\[56px\] rounded-\[18px\] border-0 pl-5 pr-12 text-base text-\[#111827\] shadow-sm ring-1 ring-inset/g, 
    "h-[56px] rounded-xl border-0 pl-4 pr-12 text-base text-[#111827] shadow-sm ring-1 ring-inset");
  
  code = code.replace(/ring-\[#E5E7EB\] focus:ring-\[#7C3AED\] group-hover:ring-gray-300/g, 
    "ring-gray-200 focus:ring-[#7C3AED] group-hover:ring-gray-300");
    
  code = code.replace(/mt-2 text-xs font-bold text-red-600 ml-1/g, 
    "mt-1.5 text-sm font-medium text-red-600 flex items-center gap-1.5");

  code = code.replace(/right-2 top-1\/2 -translate-y-1\/2 w-10 h-10/g,
    "right-3 top-1/2 -translate-y-1/2 p-2");
  
  fs.writeFileSync(filePath, code);
}

updatePasswordInput();
