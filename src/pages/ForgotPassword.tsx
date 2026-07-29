import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Capacitor } from '@capacitor/core';
import Logo from '../components/Logo';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build dynamic redirect URL supporting both web and native platforms
      const isNative = Capacitor.isNativePlatform();
      const redirectUrl = isNative 
        ? 'gigsconnect://reset-password' 
        : `${window.location.origin}/reset-password`;

      console.log('Sending forgot password reset to URL:', redirectUrl);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetError) throw resetError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'An error occurred while sending the reset link');
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

      <main className="flex-grow flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
          
        <div className="w-full max-w-md mx-auto">
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-purple dark:text-gray-400 dark:hover:text-brand-purple transition-colors mb-4 group"
                  id="forgot-password-back"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to sign in
                </Link>
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight leading-tight">
                  Reset password
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your email address to receive a secure link to reset your account credentials.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit} id="forgot-password-form">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 dark:text-gray-500">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className={`block w-full h-[54px] rounded-xl border-0 pl-12 pr-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${
                        error ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/10 focus:ring-brand-purple'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card`}
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{error}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    id="btn-send-reset-link"
                    className="flex w-full h-[56px] justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-brand-black dark:text-brand-white mb-3">
                Check your inbox
              </h2>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
                We have sent a secure password reset link to <span className="text-brand-black dark:text-brand-white font-black">{email}</span>. Please click the link inside the email to complete the reset.
              </p>
              
              <div className="space-y-4 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="w-full h-[56px] inline-flex justify-center items-center rounded-xl border border-[#7C3AED]/20 text-[#7C3AED] font-semibold text-base hover:bg-[#7C3AED]/5 transition-all duration-200"
                >
                  Resend recovery email
                </button>
                <Link
                  to="/login"
                  className="w-full h-[56px] inline-flex justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] active:translate-y-0"
                >
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </div>
      
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
