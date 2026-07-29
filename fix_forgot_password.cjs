const fs = require('fs');

const filePath = 'src/pages/ForgotPassword.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/<main className="flex-grow flex flex-col px-4 py-8 sm:px-6 lg:px-8">([\s\S]+?)<\/main>/, 
`<main className="flex-grow flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
          $1
        </div>
      </main>`);

// Fix typography inside
code = code.replace(/<h2 className="text-3xl font-black tracking-tight text-brand-black dark:text-brand-white">/g, 
  `<h2 className="text-2xl font-bold text-[#111827] tracking-tight leading-tight">`);

code = code.replace(/<p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">/g,
  `<p className="mt-2 text-sm text-gray-500">`);
  
code = code.replace(/<label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">/g,
  `<label className="block text-sm font-medium text-gray-700 mb-1.5">`);

code = code.replace(/<input\s+name="email"([\s\S]+?)className=\`block w-full h-\[54px\] rounded-xl border-0 pl-12 pr-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset \$\{([\s\S]+?)\}\s+placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card\`/g, 
`<input
                      name="email"$1className={\`block w-full h-[56px] rounded-xl border-0 pl-11 pr-4 text-base text-[#111827] shadow-sm ring-1 ring-inset \${
                        error ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-[#7C3AED]'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white\`}`);

code = code.replace(/<button\s+type="submit"\s+disabled=\{isLoading\}\s+id="btn-send-reset-link"\s+className="flex w-full h-\[54px\] justify-center items-center rounded-xl bg-brand-purple text-white text-sm font-black uppercase tracking-widest shadow-glow hover:bg-brand-purple-dark transition-all duration-200 hover:scale-\[1.02\] active:scale-\[0.98\] disabled:opacity-70 disabled:cursor-not-allowed"/g,
`<button
                    type="submit"
                    disabled={isLoading}
                    id="btn-send-reset-link"
                    className="flex w-full h-[56px] justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed gap-2"`);

fs.writeFileSync(filePath, code);
