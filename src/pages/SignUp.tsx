import { SEO } from '../components/SEO';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, Mail, Lock, AtSign } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import PasswordInput from '../components/PasswordInput';
import { toast } from 'sonner';
import { notifyError, getFriendlyErrorMessage } from '../utils/errorHandler';

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
        // After signup, auth state change will trigger in App
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
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#FAF8FF] via-[#F4EFFF] to-[#EDE5FF] dark:from-[#09080E] dark:via-[#0F0B18] dark:to-[#160E27] flex flex-col justify-center items-center px-4 py-8 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] transition-colors duration-300 relative overflow-y-auto">
      <SEO title="Sign Up | GigsConnect" noindex={true} />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/10 dark:bg-brand-purple/20 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="w-full max-w-md my-auto">
        {/* Centered Logo & Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="group flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-brand-dark-card shadow-md border border-gray-100 dark:border-white/10 flex items-center justify-center p-2 mb-3 ring-4 ring-brand-purple/10 dark:ring-brand-purple/20 group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/assets/branding/logo.svg" 
                alt="GigsConnect Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight">
              Gigs<span className="text-brand-purple">Connect</span>
            </h1>
          </Link>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 tracking-wide">
            Create, Collaborate, Earn
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl shadow-brand-purple/5 border border-gray-100 dark:border-white/10 transition-colors">
          
          {/* Segmented Pill Toggle: Log In / Sign Up */}
          <div className="flex p-1 bg-gray-100 dark:bg-[#141418] rounded-xl mb-6">
            <Link
              to="/login"
              state={state}
              className="flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-lg text-gray-600 dark:text-gray-400 hover:text-brand-black dark:hover:text-white transition-all"
            >
              Log In
            </Link>
            <span
              className="flex-1 py-2 text-center text-xs sm:text-sm font-bold rounded-lg bg-white dark:bg-brand-purple text-brand-purple dark:text-white shadow-sm transition-all"
            >
              Sign Up
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Join Africa's creative ecosystem today
            </p>
          </div>

          {supabaseError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{supabaseError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Creator Handle Input */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Creator Handle
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-brand-purple transition-colors">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full h-12 sm:h-[52px] rounded-xl border-0 pl-11 pr-24 text-sm sm:text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                    errors.username 
                      ? 'ring-red-400 focus:ring-red-500' 
                      : 'ring-gray-200 dark:ring-white/10 focus:ring-brand-purple dark:focus:ring-brand-purple group-hover:ring-gray-300 dark:group-hover:ring-white/20'
                  } focus:ring-2 focus:ring-inset bg-white dark:bg-[#141418] transition-all duration-200`}
                  placeholder="yourhandle"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                  {isCheckingUsername && <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />}
                  {!isCheckingUsername && usernameStatus === 'valid' && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      Available
                    </span>
                  )}
                  {!isCheckingUsername && usernameStatus === 'taken' && (
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 tracking-wider uppercase bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                      Taken
                    </span>
                  )}
                </div>
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-brand-purple transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full h-12 sm:h-[52px] rounded-xl border-0 pl-11 pr-4 text-sm sm:text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                    errors.email 
                      ? 'ring-red-400 focus:ring-red-500' 
                      : 'ring-gray-200 dark:ring-white/10 focus:ring-brand-purple dark:focus:ring-brand-purple group-hover:ring-gray-300 dark:group-hover:ring-white/20'
                  } focus:ring-2 focus:ring-inset bg-white dark:bg-[#141418] transition-all duration-200`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
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
                leadingIcon={<Lock className="w-4 h-4" />}
                placeholder="At least 6 characters"
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
                leadingIcon={<Lock className="w-4 h-4" />}
                placeholder="Re-enter password"
              />
            </div>

            {/* Terms notice */}
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 pt-1 leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link to="/terms-and-conditions" className="text-brand-purple hover:underline font-semibold" target="_blank">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="text-brand-purple hover:underline font-semibold" target="_blank">
                Privacy Policy
              </Link>.
            </p>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 sm:h-13 flex justify-center items-center rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm sm:text-base font-bold shadow-md shadow-brand-purple/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/10 text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                state={state}
                className="font-bold text-brand-purple hover:underline transition-all"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Community Note */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          Built for creators across Africa
        </div>
      </div>
    </div>
  );
};

export default SignUp;
