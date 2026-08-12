import { SEO } from '../components/SEO';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, Mail, Briefcase, Globe2, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import Logo from '../components/Logo';
import PasswordInput from '../components/PasswordInput';
import { toast } from 'sonner';
import { notifyError } from '../utils/errorHandler';
import { getFriendlyErrorMessage } from '../utils/errorHandler';


const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    from?: string;
    message?: string;
  } | null;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Username checking states
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'valid' | 'taken' | 'invalid'>('idle');

  const getPasswordStrength = (password: string) => {
    if (!password) return { value: 0, label: 'None' };
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 10) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    let label = 'Weak';
    if (strength > 60) label = 'Strong';
    else if (strength > 30) label = 'Medium';
    return { value: strength, label };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Normalize username inputs
    if (name === 'username') {
      const normalizedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15);
      setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Perform a unique username existence check
  useEffect(() => {
    if (!formData.username) {
      setUsernameStatus('idle');
      return;
    }

    if (formData.username.length < 3) {
      setUsernameStatus('invalid');
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const isTaken = await profilesService.isUsernameTaken(formData.username);
        if (isTaken) {
          setUsernameStatus('taken');
        } else {
          setUsernameStatus('valid');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Creator handle is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Handle must be at least 3 characters';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'This handle is already claimed';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseError(null);
    
    if (isSubmittingRef.current || !validate()) return;
    
    setIsLoading(true);
    isSubmittingRef.current = true;
    
    const loadingToastId = toast.loading('Creating your profile...', {
      description: 'Setting up your creator identity'
    });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists.');
        }
        throw error;
      }

      if (data.user && !data.session) {
        toast.success('Registration successful! Please check your email to verify your account.', { id: loadingToastId });
        navigate('/login', { state: { message: 'Please check your email to verify your account.' } });
      } else {
        toast.success('Account created successfully!', { id: loadingToastId });
        // After signup, auth state change will trigger in App.js
        // We can navigate to the next intended page or onboarding
        navigate(state?.from || '/overview');
      }
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setSupabaseError(getFriendlyErrorMessage(err));
      notifyError('Failed to create account');
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-28 relative overflow-hidden">
      <SEO title="Sign Up | GigsConnect" noindex={true} />

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
        <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 bg-gray-50/50 relative z-20 overflow-y-auto">
          <div className="w-full max-w-[460px] bg-white p-6 sm:p-10 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 my-auto">
            
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
                    className={`block w-full h-[56px] rounded-xl border-0 pl-9 pr-12 text-base text-[#111827] shadow-sm ring-1 ring-inset ${errors.username ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-[#7C3AED] group-hover:ring-gray-300'} focus:ring-2 focus:ring-inset bg-white transition-all duration-200`}
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
                    className={`block w-full h-[56px] rounded-xl border-0 pl-11 pr-4 text-base text-[#111827] shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500 animate-shake' : 'ring-gray-200 focus:ring-[#7C3AED] group-hover:ring-gray-300'} focus:ring-2 focus:ring-inset bg-white transition-all duration-200`}
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

export default SignUp;