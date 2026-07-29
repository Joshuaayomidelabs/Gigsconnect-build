const fs = require('fs');

function buildSignUpRightPanel() {
  return `        {/* RIGHT PANEL (Form) */}
        <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 bg-gray-50/50 relative z-20 overflow-y-auto">
          <div className="w-full max-w-[460px] bg-white p-8 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 my-auto">
            
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wider">Account Setup</span>
                <span className="text-xs font-medium text-gray-500">Step 1 of 5</span>
              </div>
              <div className="flex gap-1.5 w-full">
                <div className="h-1.5 flex-1 bg-[#7C3AED] rounded-full shadow-[0_0_8px_rgba(124,58,237,0.3)]"></div>
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full"></div>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-[#111827] tracking-tight leading-tight mb-2">Create Your Account</h3>
              <p className="text-gray-500 text-sm">Join Africa's fastest-growing creator community.</p>
            </div>

            {supabaseError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{supabaseError}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Creator Handle Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Creator Handle
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-medium">@</span>
                  </div>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={\`block w-full h-[56px] rounded-xl border-0 pl-9 pr-12 text-base text-[#111827] shadow-sm ring-1 ring-inset \${errors.username ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-[#7C3AED] group-hover:ring-gray-300'} focus:ring-2 focus:ring-inset bg-white transition-all duration-200\`}
                    placeholder="joshcreates"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {isCheckingUsername && <Loader2 className="w-4 h-4 animate-spin text-[#7C3AED]" />}
                    {!isCheckingUsername && usernameStatus === 'valid' && (
                      <span className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase">Available</span>
                    )}
                    {!isCheckingUsername && usernameStatus === 'taken' && (
                      <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase">Taken</span>
                    )}
                  </div>
                </div>
                {errors.username && <p className="mt-1.5 text-sm font-medium text-red-600 flex items-center gap-1.5">{errors.username}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={\`block w-full h-[56px] rounded-xl border-0 pl-11 pr-4 text-base text-[#111827] shadow-sm ring-1 ring-inset \${errors.email ? 'ring-red-300 focus:ring-red-500 animate-shake' : 'ring-gray-200 focus:ring-[#7C3AED] group-hover:ring-gray-300'} focus:ring-2 focus:ring-inset bg-white transition-all duration-200\`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-sm font-medium text-red-600 flex items-center gap-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="!mt-4">
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  showStrength={formData.password.length > 0}
                  strengthValue={strength.value}
                  strengthLabel={strength.label}
                />
              </div>

              {/* Confirm Password */}
              <div className="!mt-4">
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[56px] flex justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    'Create My Creator Profile'
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
          
          {/* Trust Section */}
          <div className="mt-8 text-center text-xs text-gray-400 font-medium tracking-wide">
            Built for creators across Africa.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;`;
}

const filePath = 'src/pages/SignUp.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const rightPanelStart = code.indexOf('{/* RIGHT PANEL (Form) */}');
if (rightPanelStart !== -1) {
  const before = code.substring(0, rightPanelStart);
  code = before + buildSignUpRightPanel();
  fs.writeFileSync(filePath, code);
  console.log("Updated SignUp.tsx right panel.");
} else {
  console.log("Could not find RIGHT PANEL marker in SignUp.tsx");
}
