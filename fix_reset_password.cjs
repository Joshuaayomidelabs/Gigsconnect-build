const fs = require('fs');

const filePath = 'src/pages/ResetPassword.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/<main className="flex-grow flex flex-col px-4 py-8 sm:px-6 lg:px-8">([\s\S]+?)<\/main>/, 
`<main className="flex-grow flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
          $1
        </div>
      </main>`);

code = code.replace(/<h2 className="text-3xl font-black tracking-tight text-brand-black dark:text-brand-white">/g, 
  `<h2 className="text-2xl font-bold text-[#111827] tracking-tight leading-tight">`);

code = code.replace(/<p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">/g,
  `<p className="mt-2 text-sm text-gray-500">`);
  
code = code.replace(/<button\s+type="submit"\s+disabled=\{isLoading\}\s+id="btn-submit-reset"\s+className="flex w-full h-\[54px\] justify-center items-center rounded-xl bg-brand-purple text-white text-sm font-black uppercase tracking-widest shadow-glow hover:bg-brand-purple-dark transition-all duration-200 hover:scale-\[1.02\] active:scale-\[0.98\] disabled:opacity-70 disabled:cursor-not-allowed"/g,
`<button
                      type="submit"
                      disabled={isLoading}
                      id="btn-submit-reset"
                      className="flex w-full h-[56px] justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed gap-2"`);

fs.writeFileSync(filePath, code);
