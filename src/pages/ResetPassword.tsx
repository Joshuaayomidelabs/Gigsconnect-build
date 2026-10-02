import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ArrowLeft, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import PasswordInput from '../components/PasswordInput';
import { getFriendlyErrorMessage } from '../utils/errorHandler';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [errorFields, setErrorFields] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Parse strength values dynamically for PasswordInput visual feedback
  const [strength, setStrength] = useState({ value: 0, label: 'Weak' });

  useEffect(() => {
    // Basic password strength measurement
    if (!password) {
      setStrength({ value: 0, label: 'Weak' });
      return;
    }
    let val = 0;
    if (password.length >= 8) val += 30;
    if (/[A-Z]/.test(password)) val += 25;
    if (/[0-9]/.test(password)) val += 25;
    if (/[^A-Za-z0-9]/.test(password)) val += 20;

    let lbl = 'Weak';
    if (val >= 75) {
      lbl = 'Strong';
    } else if (val >= 45) {
      lbl = 'Medium';
    }
    setStrength({ value: val, label: lbl });
  }, [password]);

  useEffect(() => {
    let mounted = true;

    const handleSessionSet = async () => {
      try {
        setGlobalError(null);
        // 1. Check if Supabase already initialized the session (e.g. from redirect)
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          if (mounted) {
            setHasSession(true);
            setIsInitializing(false);
          }
          return;
        }

        // 2. Parse token parameters from direct deep link url (both hash # and search ? formats)
        const hash = location.hash || window.location.hash;
        const search = location.search || window.location.search;

        let accessToken = '';
        let refreshToken = '';

        if (hash) {
          const params = new URLSearchParams(hash.replace(/^#/, ''));
          accessToken = params.get('access_token') || '';
          refreshToken = params.get('refresh_token') || '';
        }

        if (!accessToken && search) {
          const params = new URLSearchParams(search);
          accessToken = params.get('access_token') || '';
          refreshToken = params.get('refresh_token') || '';
        }

        // If we extracted the tokens, establish session
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          
          if (mounted) {
            setHasSession(true);
          }
        } else {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            if (mounted) setHasSession(true);
          } else {
            if (mounted) {
              setGlobalError('The password reset link is missing or invalid. Please request a new link.');
            }
          }
        }
      } catch (err: any) {
        console.error('Session establishment error:', err);
        if (mounted) {
          setGlobalError(getFriendlyErrorMessage(err));
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    handleSessionSet();

    return () => {
      mounted = false;
    };
  }, [location]);

  const validate = () => {
    const fields: Record<string, string> = {};
    let ok = true;

    if (!password) {
      fields.password = 'A new password is required';
      ok = false;
    } else if (password.length < 8) {
      fields.password = 'Password must be at least 8 characters';
      ok = false;
    }

    if (!confirmPassword) {
      fields.confirmPassword = 'Please confirm your password';
      ok = false;
    } else if (password !== confirmPassword) {
      fields.confirmPassword = 'New passwords do not match';
      ok = false;
    }

    setErrorFields(fields);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setGlobalError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Password reset submit error:', err);
      setGlobalError(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#FAF8FF] via-[#F4EFFF] to-[#EDE5FF] dark:from-[#09080E] dark:via-[#0F0B18] dark:to-[#160E27] flex flex-col justify-center items-center px-4">
        <SEO title="Reset Password | GigsConnect" noindex={true} />
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-purple animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">Verifying link authenticity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#FAF8FF] via-[#F4EFFF] to-[#EDE5FF] dark:from-[#09080E] dark:via-[#0F0B18] dark:to-[#160E27] flex flex-col justify-center items-center px-4 py-8 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] transition-colors duration-300 relative overflow-y-auto">
      <SEO title="Reset Password | GigsConnect" noindex={true} />

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
          {!isSuccess ? (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight">
                  New Password
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Create a secure password for your account
                </p>
              </div>

              {!hasSession && (
                <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center">
                  <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
                    {globalError || 'Your password recovery token could not be verified.'}
                  </p>
                  <Link
                    to="/forgot-password"
                    className="inline-flex h-10 px-5 items-center justify-center bg-brand-purple text-white font-bold text-xs rounded-xl hover:bg-brand-purple-hover"
                  >
                    Request a new link
                  </Link>
                </div>
              )}

              {hasSession && (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <PasswordInput
                    label="New Password"
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errorFields.password}
                    showStrength={password.length > 0}
                    strengthValue={strength.value}
                    strengthLabel={strength.label}
                    leadingIcon={<Lock className="w-4 h-4" />}
                    required
                    disabled={isLoading}
                  />

                  <PasswordInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errorFields.confirmPassword}
                    leadingIcon={<Lock className="w-4 h-4" />}
                    required
                    disabled={isLoading}
                  />

                  {globalError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{globalError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 sm:h-13 flex justify-center items-center rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm sm:text-base font-bold shadow-md shadow-brand-purple/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/10 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-purple hover:underline transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Log In
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-brand-purple/5">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-brand-black dark:text-brand-white mb-2">
                Password updated
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
                Your credentials have been securely updated. You can now log into your GigsConnect account using your new password.
              </p>
              
              <Link
                to="/login"
                className="w-full h-12 inline-flex justify-center items-center rounded-xl bg-brand-purple text-white text-xs sm:text-sm font-bold hover:bg-brand-purple-hover shadow-md shadow-brand-purple/20 transition-all cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
