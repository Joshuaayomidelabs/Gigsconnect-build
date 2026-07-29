import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import Logo from '../components/Logo';
import PasswordInput from '../components/PasswordInput';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    email?: string; 
    signupSuccess?: boolean;
    from?: string;
    message?: string;
  } | null;

  const [formData, setFormData] = useState({
    email: state?.email || '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSupabaseError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      if (data.user) {
        console.log('Login Successful - User ID:', data.user.id);
      }

      // Redirect back to original page or dashboard
      const from = state?.from || '/overview';
      navigate(from, { replace: true });
    } catch (error: any) {
      const isInvalidCreds = error?.message?.toLowerCase().includes('invalid login credentials');
      if (isInvalidCreds) {
        setSupabaseError('Invalid email or password. Please check your credentials or sign up below if you do not have an account.');
      } else {
        console.error('Login error:', error);
        setSupabaseError(error.message || 'An error occurred during sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-28 relative overflow-hidden">
      {/* Editorial Background Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1.5px, transparent 1.5px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent to-[#F9FAFB] opacity-80"></div>

      {/* 1440px Centered Container */}
      <div className="w-full max-w-[1440px] bg-white rounded-[32px] shadow-2xl shadow-[#111827]/[0.02] border border-[#E5E7EB]/40 overflow-hidden flex flex-col md:flex-row min-h-[85vh] relative z-10">
        
                {/* LEFT PANEL */}
        <div className="w-full md:w-[45%] lg:w-[50%] p-8 md:p-12 lg:p-16 flex flex-col relative z-10 overflow-hidden bg-gradient-to-br from-white via-[#F8F5FF] to-[#EBE4FF] border-r border-[#7C3AED]/10">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9333EA]/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Subtle Abstract Shapes / Patterns */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#7C3AED 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 flex-none mb-8 mt-2">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#7C3AED]/20 text-[11px] font-black text-[#7C3AED] uppercase tracking-[0.15em] w-fit mb-8 shadow-sm">
              Africa's Creator Ecosystem
            </span>
            <h2 className="text-4xl lg:text-[3.25rem] font-black text-[#111827] tracking-tight leading-[1.05] mb-6">
              Africa's Home for<br/>Every Creator
            </h2>
            <p className="text-[#111827]/70 text-base lg:text-lg font-medium leading-relaxed max-w-[420px]">
              Build your creative identity, showcase your work, discover opportunities, collaborate with brands, and grow your career across Africa—all from one platform.
            </p>
          </div>

          {/* Storytelling Scene (Desktop & Tablet) */}
          <div className="flex-1 relative w-full hidden md:block min-h-[400px] mt-4">
            
            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.4 }}>
              <path d="M 20% 30% C 40% 10%, 60% 40%, 75% 20%" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="animate-pulse" />
              <path d="M 30% 70% C 50% 90%, 70% 60%, 85% 75%" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <path d="M 25% 40% C 50% 50%, 40% 70%, 65% 65%" stroke="#9333EA" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            </svg>

            {/* Central glowing hub */}
            <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/40 rounded-full blur-2xl z-0"></div>

            {/* Creators Floating */}
            {/* Photographer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[10%] left-[10%] w-[45%] max-w-[180px] z-20"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/photographer.svg" alt="Photographer" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>

            {/* Web Creator */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute top-[5%] right-[5%] w-[40%] max-w-[160px] z-10"
            >
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/web-creator.svg" alt="Web Creator" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>

            {/* Content Creator / Media */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="absolute bottom-[10%] right-[15%] w-[50%] max-w-[200px] z-30"
            >
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/content-creator.svg" alt="Content Creator" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>
            
            {/* DJ / Music */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="absolute bottom-[5%] left-[5%] w-[35%] max-w-[140px] z-10"
            >
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/dj-bro.svg" alt="Music Creator" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>

            {/* Floating UI Elements / Geometric Shapes */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] left-[45%] w-8 h-8 rounded-lg border-2 border-[#7C3AED]/30 z-0"></motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[25%] right-[35%] w-4 h-4 rounded-full bg-[#F59E0B]/40 z-0"></motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[35%] left-[30%] w-3 h-3 rounded-full bg-[#10B981]/40 z-0"></motion.div>

          </div>

          {/* Mobile Simplified Scene */}
          <div className="flex md:hidden relative w-full h-[240px] mt-4 items-center justify-center">
            <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-[2rem] transform rotate-2"></div>
            <img src="/assets/illustrations/landing/teamwork.svg" alt="Creators" className="w-[80%] h-auto object-contain relative z-10 drop-shadow-lg" />
          </div>
        </div>

                {/* RIGHT PANEL (Form) */}
        <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 bg-gray-50/50 relative z-20">
          <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
            
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
                  className={`block w-full h-[56px] rounded-xl border-0 px-4 text-base text-[#111827] shadow-sm ring-1 ring-inset ${
                    errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-[#7C3AED]'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white`}
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

export default Login;