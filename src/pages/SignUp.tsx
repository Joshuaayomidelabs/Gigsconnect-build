import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Check, User, AlertCircle, Sparkles, KeyRound, Mail } from 'lucide-react';
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
      newErrors.username = 'Username handle is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'This username is already claimed';
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSubmittingRef.current) return;
    
    if (!validate()) {
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    setSupabaseError(null);

    try {
      // Check username registration to be completely bulletproof
      const isTaken = await profilesService.isUsernameTaken(formData.username);
      if (isTaken) {
        throw new Error('This username is already taken. Please choose another.');
      }

      // 1. Create User via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.username,
            role: 'Musician',
            skills: [],
            country: '',
            city_town: '',
          }
        }
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('already registered') || 
            authError.message.toLowerCase().includes('duplicate')) {
          throw new Error('An account with this email already exists.');
        }
        throw authError;
      }
      
      const userId = authData.user?.id;
      if (!userId) throw new Error('Failed to create user account');

      console.log('Signup Successful - Born User:', userId);

      // 2. Immediately Update and synchronize the Profile database row with the user fields.
      const syncProfileData: any = {
        full_name: formData.username,
        username: formData.username,
        role: 'Musician',
        skills: [],
        city: '',
        country: '',
        onboarding_completed: false,
        onboarding_progress: 20 // 20% for signup completed
      };

      const { error: syncError } = await profilesService.updateProfile(syncProfileData);
      if (syncError) {
        console.error('Non-critical profiling sync fail:', syncError);
      }

      // Dispatch refresh across app components
      window.dispatchEvent(new CustomEvent('profile-updated'));
      toast.success('Welcome to GigsConnect!');

      // Redirect directly to the feed (immediate access) for minimum friction onboarding
      navigate('/overview', { replace: true });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setSupabaseError(error.message || 'An error occurred during signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col font-sans transition-colors duration-500 relative overflow-hidden">
      {/* Ambient background aesthetics */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Header */}
      <div className="pt-8 px-6 flex justify-center sm:justify-start max-w-lg mx-auto w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <Logo iconClassName="w-8 h-8" />
          <h1 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tighter">
            Gigs<span className="text-brand-purple">Connect</span>
          </h1>
        </Link>
      </div>

      <main className="flex-grow flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-lg mx-auto">
          {/* Progress Headers */}
          <div className="mb-6 text-center">
            {/* Creative equalizer musical artwork */}
            <div className="flex items-center justify-center gap-1 px-4 py-1.5 rounded-full bg-brand-purple/5 border border-brand-purple/10 w-fit mx-auto mb-4">
              <div className="h-4 w-1 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.9s' }}></div>
              <div className="h-6 w-1 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.7s' }}></div>
              <div className="h-5 w-1 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1.1s' }}></div>
              <div className="h-3 w-1 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '0.8s' }}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple/90 ml-1.5">Claim Your Sound</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-brand-black dark:text-brand-white">
              Join GigsConnect
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Choose your unique handle and connect with bands, artists, and live gig opportunities.
            </p>
          </div>

          <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] p-6 sm:p-10 shadow-xl border border-brand-purple/10">
            {supabaseError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold leading-relaxed flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{supabaseError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username Input Handle */}
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">
                    Username / Handle <span className="text-brand-purple">*</span>
                  </label>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">Letters, numbers, underscores only</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-black text-sm">@</span>
                  </div>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`block w-full h-[52px] rounded-xl border-0 pl-8 pr-12 text-sm text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.username ? 'ring-red-300' : 'ring-brand-purple/15'} focus:ring-2 focus:ring-inset bg-brand-gray dark:bg-brand-black focus:bg-white dark:focus:bg-brand-dark-card transition-all`}
                    placeholder="musician_handle"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {isCheckingUsername && <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />}
                    {!isCheckingUsername && usernameStatus === 'valid' && (
                      <span className="text-xs font-black text-emerald-500 tracking-wider">OK</span>
                    )}
                    {!isCheckingUsername && usernameStatus === 'taken' && (
                      <span className="text-xs font-black text-red-500 tracking-wider">TAKEN</span>
                    )}
                    {!isCheckingUsername && usernameStatus === 'invalid' && (
                      <span className="text-xs font-bold text-gray-400">Min 3 char</span>
                    )}
                  </div>
                </div>
                {errors.username && <p className="mt-1.5 text-xs font-semibold text-red-600 ml-1">{errors.username}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#9CA3AF] mb-1.5 ml-1">
                  Email Address <span className="text-brand-purple">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full h-[52px] rounded-xl border-0 pl-11 pr-4 text-sm text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 animate-shake' : 'ring-brand-purple/15'} focus:ring-2 focus:ring-inset bg-brand-gray dark:bg-brand-black focus:bg-white dark:focus:bg-brand-dark-card transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-650 ml-1">{errors.email}</p>}
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
                  required
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
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[54px] flex justify-center items-center rounded-xl bg-brand-purple text-white text-sm font-black uppercase tracking-widest hover:bg-brand-purple-hover active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center pt-5 border-t border-brand-purple/5">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-brand-purple hover:text-brand-purple-hover font-black underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
