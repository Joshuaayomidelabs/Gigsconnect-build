const fs = require('fs');

function buildLoginRightPanel() {
  return `        {/* RIGHT PANEL (Form) */}
        <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 bg-gray-50/50 relative z-20">
          <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-[#111827] tracking-tight leading-tight mb-2">Welcome back to GigsConnect</h3>
              <p className="text-gray-500 text-sm">Enter your details to sign in to your account</p>
            </div>

            {state?.message && (
              <div className="mb-6 p-4 rounded-xl bg-[#7C3AED]/5 border border-[#7C3AED]/20 text-[#7C3AED] text-sm text-center font-medium">
                {state.message}
              </div>
            )}
            {state?.signupSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-[#7C3AED]/5 border border-[#7C3AED]/20 text-[#7C3AED] text-sm text-center font-medium">
                Your account has been created. Please check your email and verify your address before logging in.
              </div>
            )}
            
            {supabaseError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{supabaseError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={\`block w-full h-[56px] rounded-xl border-0 px-4 text-base text-[#111827] shadow-sm ring-1 ring-inset \${
                    errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-[#7C3AED]'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white\`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1.5 text-sm font-medium text-red-600 flex items-center gap-1.5">{errors.email}</p>}
              </div>

              <div className="!mt-5">
                <PasswordInput
                  label="Password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1 pb-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED] transition-all cursor-pointer bg-white"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[56px] flex justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  state={state}
                  className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-400 font-medium tracking-wide">
            Your information is securely protected.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;`;
}

const filePath = 'src/pages/Login.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const rightPanelStart = code.indexOf('{/* RIGHT PANEL (Form) */}');
if (rightPanelStart !== -1) {
  const before = code.substring(0, rightPanelStart);
  code = before + buildLoginRightPanel();
  fs.writeFileSync(filePath, code);
  console.log("Updated Login.tsx right panel.");
} else {
  console.log("Could not find RIGHT PANEL marker in Login.tsx");
}
