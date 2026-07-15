import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Loader2, AlertCircle, Mail, Briefcase, Globe2, Sparkles,
  Music, Sliders, Camera, Video, Palette, Layout, Code, 
  Shirt, Smartphone, Feather, Mic, Clapperboard, Brush, Calendar, Megaphone
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import Logo from '../components/Logo';
import PasswordInput from '../components/PasswordInput';
import { toast } from 'sonner';

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
      setSupabaseError(err.message || 'An error occurred during sign up.');
      toast.error('Failed to create account', { 
        id: loadingToastId,
        description: err.message || 'Please try again.'
      });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-28 relative overflow-hidden">
      {/* Editorial Background Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1.5px, transparent 1.5px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent to-[#F9FAFB] opacity-80"></div>

      {/* 1440px Centered Container */}
      <div className="w-full max-w-[1440px] bg-white rounded-[32px] shadow-2xl shadow-[#111827]/[0.02] border border-[#E5E7EB]/40 overflow-hidden flex flex-col md:flex-row min-h-[85vh] relative z-10">
        
        {/* LEFT PANEL (38%) */}
        <div className="w-full md:w-[38%] p-8 md:p-12 lg:p-16 flex flex-col relative bg-white z-10">
          {/* Branding Header */}
          <div className="flex-none mb-12 mt-2 md:mt-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#7C3AED]/5 border border-[#7C3AED]/10 text-[11px] font-black text-[#7C3AED] uppercase tracking-[0.15em] w-fit mb-10 shadow-sm shadow-[#7C3AED]/5">
              AFRICA'S CREATOR ECOSYSTEM
            </span>

            <h2 className="text-4xl lg:text-[3.25rem] font-black text-[#111827] tracking-tight leading-[1.05] mb-8">
              Build Your<br/>Creative Identity
            </h2>

            <p className="text-[#111827]/70 text-lg font-medium leading-relaxed max-w-[360px]">
              Create your creator profile, showcase your work, discover opportunities and collaborate with creators and brands across Africa.
            </p>
          </div>

          {/* Desktop Creator Ecosystem Collage (lower 60-65%) */}
          <div className="flex-1 relative w-full hidden md:block min-h-[460px] mt-2">
            {/* Subtle Connector Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {/* Lines between cards to show collaboration */}
              <path d="M 25% 15% Q 35% 20% 45% 25%" stroke="#7C3AED" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" />
              <path d="M 55% 25% Q 75% 15% 85% 15%" stroke="#7C3AED" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" />
              <path d="M 50% 35% Q 55% 50% 45% 65%" stroke="#7C3AED" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" />
              <path d="M 85% 25% Q 75% 40% 80% 55%" stroke="#7C3AED" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" />
              <path d="M 20% 45% Q 30% 60% 40% 65%" stroke="#7C3AED" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" />
              <path d="M 45% 75% Q 55% 85% 65% 85%" stroke="#7C3AED" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" />
            </svg>

            {/* Organic composition of creator professions */}
            <div className="absolute top-[5%] left-[15%] w-20 h-20 rounded-full bg-[#F3F4F6] border-4 border-white shadow-lg flex items-center justify-center z-10 transition-transform hover:scale-105 duration-300">
              <Music className="w-8 h-8 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[12%] left-[40%] w-24 h-24 rounded-full bg-[#F9FAFB] border-[5px] border-white shadow-xl flex items-center justify-center z-20 transition-transform hover:scale-105 duration-300">
              <Camera className="w-10 h-10 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[8%] left-[75%] w-16 h-16 rounded-full bg-[#F3F4F6] border-4 border-white shadow-md flex items-center justify-center z-10 transition-transform hover:scale-105 duration-300">
              <Code className="w-6 h-6 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[38%] left-[10%] w-16 h-16 rounded-full bg-[#F9FAFB] border-4 border-white shadow-md flex items-center justify-center z-10 transition-transform hover:scale-105 duration-300">
              <Sliders className="w-6 h-6 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[50%] left-[32%] w-[100px] h-[100px] rounded-full bg-white border-[6px] border-[#F9FAFB] shadow-2xl flex items-center justify-center z-30 transition-transform hover:scale-105 hover:shadow-3xl duration-300">
              <Video className="w-12 h-12 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[40%] left-[70%] w-20 h-20 rounded-full bg-[#F3F4F6] border-4 border-white shadow-lg flex items-center justify-center z-20 transition-transform hover:scale-105 duration-300">
              <Palette className="w-8 h-8 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[75%] left-[18%] w-16 h-16 rounded-full bg-[#F9FAFB] border-4 border-white shadow-md flex items-center justify-center z-10 transition-transform hover:scale-105 duration-300">
              <Feather className="w-6 h-6 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[70%] left-[60%] w-24 h-24 rounded-full bg-[#F3F4F6] border-4 border-white shadow-xl flex items-center justify-center z-20 transition-transform hover:scale-105 duration-300">
              <Mic className="w-10 h-10 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[65%] left-[85%] w-14 h-14 rounded-full bg-[#F9FAFB] border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform hover:scale-105 duration-300">
              <Layout className="w-5 h-5 text-[#7C3AED]" />
            </div>

            {/* Smaller supporting elements */}
            <div className="absolute top-[25%] left-[5%] w-12 h-12 rounded-full bg-[#F3F4F6] border-[3px] border-white shadow-sm flex items-center justify-center z-0 transition-transform hover:scale-105 duration-300">
              <Smartphone className="w-4 h-4 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[0%] left-[55%] w-12 h-12 rounded-full bg-[#F9FAFB] border-[3px] border-white shadow-sm flex items-center justify-center z-0 transition-transform hover:scale-105 duration-300">
              <Brush className="w-4 h-4 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[25%] left-[90%] w-12 h-12 rounded-full bg-[#F3F4F6] border-[3px] border-white shadow-sm flex items-center justify-center z-0 transition-transform hover:scale-105 duration-300">
              <Clapperboard className="w-4 h-4 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[88%] left-[40%] w-12 h-12 rounded-full bg-[#F9FAFB] border-[3px] border-white shadow-sm flex items-center justify-center z-0 transition-transform hover:scale-105 duration-300">
              <Calendar className="w-4 h-4 text-[#7C3AED]" />
            </div>

            <div className="absolute top-[55%] left-[5%] w-12 h-12 rounded-full bg-[#F3F4F6] border-[3px] border-white shadow-sm flex items-center justify-center z-0 transition-transform hover:scale-105 duration-300">
              <Shirt className="w-4 h-4 text-[#7C3AED]" />
            </div>
            
            <div className="absolute top-[85%] left-[80%] w-12 h-12 rounded-full bg-[#F9FAFB] border-[3px] border-white shadow-sm flex items-center justify-center z-0 transition-transform hover:scale-105 duration-300">
              <Megaphone className="w-4 h-4 text-[#7C3AED]" />
            </div>
          </div>

          {/* Mobile Swipeable Gallery */}
          <div className="mt-8 flex md:hidden overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            <div className="w-20 h-20 shrink-0 rounded-full bg-[#F3F4F6] border-[3px] border-white shadow-md flex items-center justify-center snap-center">
              <Video className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div className="w-20 h-20 shrink-0 rounded-full bg-[#F9FAFB] border-[3px] border-white shadow-md flex items-center justify-center snap-center">
              <Camera className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div className="w-20 h-20 shrink-0 rounded-full bg-[#F3F4F6] border-[3px] border-white shadow-md flex items-center justify-center snap-center">
              <Music className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div className="w-20 h-20 shrink-0 rounded-full bg-[#F9FAFB] border-[3px] border-white shadow-md flex items-center justify-center snap-center">
              <Palette className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div className="w-20 h-20 shrink-0 rounded-full bg-[#F3F4F6] border-[3px] border-white shadow-md flex items-center justify-center snap-center">
              <Mic className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div className="w-20 h-20 shrink-0 rounded-full bg-[#F9FAFB] border-[3px] border-white shadow-md flex items-center justify-center snap-center">
              <Code className="w-8 h-8 text-[#7C3AED]" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (62%) */}
        <div className="w-full md:w-[62%] flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-white relative z-20">
          <div className="w-full max-w-[480px] mx-auto">
            
            {/* Progress & Header */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Step 1 of 5</span>
                <div className="flex gap-2">
                  <div className="h-1.5 w-10 bg-[#7C3AED] rounded-full shadow-sm shadow-[#7C3AED]/20"></div>
                  <div className="h-1.5 w-3 bg-[#F3F4F6] rounded-full"></div>
                  <div className="h-1.5 w-3 bg-[#F3F4F6] rounded-full"></div>
                  <div className="h-1.5 w-3 bg-[#F3F4F6] rounded-full"></div>
                  <div className="h-1.5 w-3 bg-[#F3F4F6] rounded-full"></div>
                </div>
              </div>
              <h3 className="text-[2rem] font-black text-[#111827] tracking-tight leading-tight">Create Account</h3>
              <p className="text-[#111827]/60 font-medium mt-2 text-base">Let's build your creator profile.</p>
            </div>

            {supabaseError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold leading-relaxed flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{supabaseError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Creator Handle Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                  Creator Handle
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-black text-sm">@</span>
                  </div>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`block w-full h-[56px] rounded-[18px] border-0 pl-9 pr-12 text-base text-[#111827] shadow-sm ring-1 ring-inset ${errors.username ? 'ring-red-300 focus:ring-red-500' : 'ring-[#E5E7EB] focus:ring-[#7C3AED] group-hover:ring-gray-300'} focus:ring-2 focus:ring-inset bg-white transition-all`}
                    placeholder="joshcreates"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {isCheckingUsername && <Loader2 className="w-4 h-4 animate-spin text-[#7C3AED]" />}
                    {!isCheckingUsername && usernameStatus === 'valid' && (
                      <span className="text-[10px] font-black text-emerald-500 tracking-wider uppercase">Available</span>
                    )}
                    {!isCheckingUsername && usernameStatus === 'taken' && (
                      <span className="text-[10px] font-black text-red-500 tracking-wider uppercase">Taken</span>
                    )}
                  </div>
                </div>
                {errors.username && <p className="mt-1.5 text-xs font-bold text-red-600 ml-1">{errors.username}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
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
                    className={`block w-full h-[56px] rounded-[18px] border-0 pl-11 pr-4 text-base text-[#111827] shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500 animate-shake' : 'ring-[#E5E7EB] focus:ring-[#7C3AED] group-hover:ring-gray-300'} focus:ring-2 focus:ring-inset bg-white transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs font-bold text-red-600 ml-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  showStrength={formData.password.length > 0}
                  strengthValue={strength.value}
                  strengthLabel={strength.label}
                  className="group-hover:ring-gray-300 bg-white dark:bg-white text-[#111827] ring-[#E5E7EB]"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  className="group-hover:ring-gray-300 bg-white dark:bg-white text-[#111827] ring-[#E5E7EB]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[56px] flex justify-center items-center rounded-[18px] bg-[#7C3AED] text-white text-base font-bold tracking-wide hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none cursor-pointer gap-2"
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

            {/* Trust Section */}
            <div className="mt-10 pt-8 border-t border-[#E5E7EB] grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-[#7C3AED]/5 transition-colors">
                  <Sparkles className="w-4 h-4 text-gray-500 group-hover:text-[#7C3AED] transition-colors" />
                </div>
                <span className="text-[10px] font-black text-[#111827] uppercase tracking-wider leading-relaxed">Find<br/>Opportunities</span>
              </div>
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-[#7C3AED]/5 transition-colors">
                  <Briefcase className="w-4 h-4 text-gray-500 group-hover:text-[#7C3AED] transition-colors" />
                </div>
                <span className="text-[10px] font-black text-[#111827] uppercase tracking-wider leading-relaxed">Build Your<br/>Portfolio</span>
              </div>
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-[#7C3AED]/5 transition-colors">
                  <Globe2 className="w-4 h-4 text-gray-500 group-hover:text-[#7C3AED] transition-colors" />
                </div>
                <span className="text-[10px] font-black text-[#111827] uppercase tracking-wider leading-relaxed">Connect<br/>Across Africa</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-gray-500">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-[#111827] hover:text-[#7C3AED] font-black transition-colors underline decoration-gray-300 underline-offset-4 hover:decoration-[#7C3AED]"
                >
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

