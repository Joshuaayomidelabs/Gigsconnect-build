import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import PasswordInput from '../components/PasswordInput';
import Logo from '../components/Logo';
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

        // If we extracted the oauth values, securely establish a Supabase Auth session manually
        if (accessToken && refreshToken) {
          console.log('Detected recovery tokens, logging in...');
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          
          if (mounted) {
            setHasSession(true);
          }
        } else {
          // If no token was found in the hash, check Supabase auth once more (give listener a split second)
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
      // Call Supabase updateUser to assign the new password
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
      <div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-black transition-colors">
      <SEO title="Reset Password | GigsConnect" noindex={true} />

        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-purple animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium font-sans">Verifying link authenticity...</p>
        </div>
      </div>
    );
  }

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
          
        <div className="w-full max-w-md mx-auto" id="reset-password-container">
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight leading-tight">
                  New Password
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Please pick a strong, secure password that you don't use elsewhere.
                </p>
              </div>

              {!hasSession && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-center">
                  <p className="text-sm font-bold text-red-600 mb-4 h-auto leading-relaxed">
                    {globalError || 'Your password recovery token could not be verified.'}
                  </p>
                  <Link
                    to="/forgot-password"
                    id="btn-retry-reset"
                    className="inline-flex h-12 px-6 items-center justify-center bg-brand-purple text-brand-white font-bold text-sm rounded-xl hover:bg-brand-purple-hover"
                  >
                    Request a new link
                  </Link>
                </div>
              )}

              {hasSession && (
                <form className="space-y-5" onSubmit={handleSubmit} id="reset-password-form">
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
                    required
                    disabled={isLoading}
                  />

                  {globalError && (
                    <div className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/40 text-center">
                      {globalError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      id="btn-submit-reset"
                      className="flex w-full h-[56px] justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-brand-black dark:text-brand-white mb-3">
                Password updated
              </h2>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
                Your credentials have been securely updated. You can now log into your GigsConnect account using your new password.
              </p>
              
              <Link
                to="/login"
                id="btn-goto-login-success"
                className="w-full max-w-xs mx-auto h-[56px] flex justify-center items-center rounded-xl bg-[#7C3AED] text-white text-base font-semibold hover:bg-[#6D28D9] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] active:translate-y-0"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
