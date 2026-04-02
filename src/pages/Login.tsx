import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col font-sans transition-colors duration-500">
      {/* Minimal Header */}
      <div className="pt-8 px-6 flex justify-center sm:justify-start max-w-md mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <Logo iconClassName="w-8 h-8" />
          <h1 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tighter">
            Gigs<span className="text-brand-purple">Connect</span>
          </h1>
        </Link>
      </div>

      <main className="flex-grow flex flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-brand-black dark:text-brand-white">
              Sign in
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
              Welcome back to GigsConnect
            </p>
          </div>

          <div className="w-full">
            {state?.message && (
              <div className="mb-6 p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/20 text-brand-purple text-sm text-center font-medium">
                {state.message}
              </div>
            )}
            {state?.signupSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-brand-purple/5 dark:bg-brand-purple/20 border border-brand-purple/20 text-brand-purple text-sm text-center font-medium">
                Your account has been created. Please check your email and verify your address before logging in.
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full h-[54px] rounded-xl border-0 px-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/10 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.email}</p>}
              </div>

              <PasswordInput
                label="Password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-brand-purple/30 text-brand-purple focus:ring-brand-purple transition-all cursor-pointer bg-white dark:bg-brand-black"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-bold text-brand-purple hover:text-brand-purple-hover transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full h-[54px] justify-center items-center rounded-xl bg-brand-purple text-white text-sm font-black uppercase tracking-widest shadow-glow hover:bg-brand-purple-dark transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
              
              {supabaseError && (
                <div className="mt-4 text-xs font-bold text-red-600 text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/40">
                  {supabaseError}
                </div>
              )}
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  state={state}
                  className="text-brand-purple hover:text-brand-purple-hover transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
