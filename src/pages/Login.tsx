import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Loader2, AlertCircle, 
  Music, Sliders, Camera, Video, Palette, Layout, Code, 
  Shirt, Smartphone, Feather, Mic, Clapperboard, Brush, Calendar, Megaphone
} from 'lucide-react';
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
      console.error('Login error:', error);
      setSupabaseError(error.message || 'An error occurred during sign in');
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
        
        {/* LEFT PANEL (38%) */}
        <div className="w-full md:w-[38%] p-8 md:p-12 lg:p-16 flex flex-col relative bg-white z-10">
          {/* Branding Header */}
          <div className="flex-none mb-12 mt-2 md:mt-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#7C3AED]/5 border border-[#7C3AED]/10 text-[11px] font-black text-[#7C3AED] uppercase tracking-[0.15em] w-fit mb-10 shadow-sm shadow-[#7C3AED]/5">
              AFRICA'S CREATOR ECOSYSTEM
            </span>

            <h2 className="text-4xl lg:text-[3.25rem] font-black text-[#111827] tracking-tight leading-[1.05] mb-8">
              Welcome Back
            </h2>

            <p className="text-[#111827]/70 text-lg font-medium leading-relaxed max-w-[360px]">
              Continue your creative journey.
            </p>
          </div>

          {/* Desktop Creator Ecosystem Collage */}
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
            
            {/* Header */}
            <div className="mb-10">
              <span className="inline-block text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4">
                WELCOME BACK
              </span>
              <h3 className="text-[2rem] font-black text-[#111827] tracking-tight leading-tight">Sign In</h3>
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
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold leading-relaxed flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{supabaseError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full h-[56px] rounded-[18px] border-0 px-5 text-base text-[#111827] shadow-sm ring-1 ring-inset ${
                    errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-[#E5E7EB] focus:ring-[#7C3AED]'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.email}</p>}
              </div>

              <div className="!mt-6">
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

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED] transition-all cursor-pointer bg-white"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm font-bold text-gray-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[56px] flex justify-center items-center rounded-[18px] bg-[#7C3AED] text-white text-base font-bold tracking-wide hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none cursor-pointer gap-2"
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

            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-gray-500">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  state={state}
                  className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
