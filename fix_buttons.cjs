const fs = require('fs');

function fixForgotPassword() {
  const file = 'src/pages/ForgotPassword.tsx';
  let code = fs.readFileSync(file, 'utf8');
  
  // Resend button
  code = code.replace(/<button\s+type="button"\s+onClick=\{([\s\S]+?)\}\s+className="w-full h-12 inline-flex justify-center items-center rounded-xl border border-brand-purple\/20 text-brand-purple font-bold text-sm bg-brand-purple\/5 hover:bg-brand-purple\/10 transition-all duration-200"\s+>/,
  `<button
                  type="button"
                  onClick={$1}
                  className="w-full h-[56px] inline-flex justify-center items-center rounded-xl border border-[#7C3AED]/20 text-[#7C3AED] font-semibold text-base hover:bg-[#7C3AED]/5 transition-all duration-200"
                >`);

  // Return to login
  code = code.replace(/<Link\s+to="\/login"\s+className="w-full h-12 inline-flex justify-center items-center rounded-xl bg-brand-purple text-white text-sm font-black uppercase tracking-widest shadow-glow hover:bg-brand-purple-dark transition-all duration-200 hover:scale-\[1.02\] active:scale-\[0.98\]"/,
  `<Link
                  to="/login"
                  className="w-full h-[56px] inline-flex justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] active:translate-y-0"`);
  
  fs.writeFileSync(file, code);
}

function fixResetPassword() {
  const file = 'src/pages/ResetPassword.tsx';
  let code = fs.readFileSync(file, 'utf8');
  
  code = code.replace(/<Link\s+to="\/login"\s+id="btn-goto-login-success"\s+className="w-full max-w-xs mx-auto h-\[54px\] flex justify-center items-center rounded-xl bg-brand-purple text-white text-sm font-black uppercase tracking-widest shadow-glow hover:bg-brand-purple-dark transition-all duration-200 hover:scale-\[1.02\] active:scale-\[0.98\]"/,
  `<Link
                to="/login"
                id="btn-goto-login-success"
                className="w-full max-w-xs mx-auto h-[56px] flex justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] active:translate-y-0"`);
  
  fs.writeFileSync(file, code);
}

fixForgotPassword();
fixResetPassword();
