import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { africanCountries, getStatesForCountry, musicProfessions } from '../utils/locations';
import Logo from '../components/Logo';
import PasswordInput from '../components/PasswordInput';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    from?: string;
    message?: string;
  } | null;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    country: '',
    cityTown: '',
  });
  
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

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

  useEffect(() => {
    if (formData.country) {
      const states = getStatesForCountry(formData.country);
      setAvailableStates(states);
    } else {
      setAvailableStates([]);
    }
  }, [formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleProfession = (profession: string) => {
    setSelectedProfessions(prev => {
      const newSelection = prev.includes(profession)
        ? prev.filter(p => p !== profession)
        : [...prev, profession];
      
      if (errors.professions && newSelection.length > 0) {
        setErrors(e => ({ ...e, professions: '' }));
      }
      return newSelection;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.cityTown.trim()) newErrors.cityTown = 'City/Town is required';
    if (selectedProfessions.length === 0) newErrors.professions = 'Select at least one profession';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    setSupabaseError(null);

    try {
      // 1. Create user in auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;
      
      const userId = authData.user?.id;
      if (!userId) throw new Error('Failed to create user account');
      
      console.log('Signup Successful - User ID:', userId);

      // 2. Insert into profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,   // MUST match auth.users.id
          full_name: formData.fullName,
          phone: formData.phoneNumber,
          role: selectedProfessions[0] || 'Musician',
          skills: selectedProfessions,
          country: formData.country,
          city_town: formData.cityTown,
        }, { onConflict: 'id' });

      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      // Success! Redirect to onboarding
      navigate('/create-profile', { replace: true });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setSupabaseError(error.message || 'An error occurred during signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col font-sans transition-colors duration-500">
      {/* Minimal Header */}
      <div className="pt-8 px-6 flex justify-center sm:justify-start max-w-2xl mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <Logo iconClassName="w-8 h-8" />
          <h1 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tighter">
            Gigs<span className="text-brand-purple">Connect</span>
          </h1>
        </Link>
      </div>

      <main className="flex-grow flex flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-brand-black dark:text-brand-white">
              Create account
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
              Join the GigsConnect community today
            </p>
          </div>

          <div className="w-full">
            {state?.message && (
              <div className="mb-6 p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/20 text-brand-purple text-sm text-center font-medium">
                {state.message}
              </div>
            )}

            {supabaseError && (
              <div className="mb-6 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/40">
                {supabaseError}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              
              {/* 1. Account Information */}
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-purple mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-brand-purple text-white flex items-center justify-center text-[10px]">1</span>
                  Account
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full h-[54px] rounded-xl border-0 px-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/10 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.email}</p>}
                  </div>

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
                </div>
              </section>

              {/* 2. Personal Information */}
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-purple mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-brand-purple text-white flex items-center justify-center text-[10px]">2</span>
                  Personal
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`block w-full h-[54px] rounded-xl border-0 px-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.fullName ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/10 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.fullName}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`block w-full h-[54px] rounded-xl border-0 px-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.phoneNumber ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/10 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card`}
                      placeholder="+234 800 000 0000"
                    />
                    {errors.phoneNumber && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.phoneNumber}</p>}
                  </div>
                </div>
              </section>

              {/* 3. Location */}
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-purple mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-brand-purple text-white flex items-center justify-center text-[10px]">3</span>
                  Location
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`block w-full h-[54px] rounded-xl border-0 px-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.country ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/10 focus:ring-brand-purple'} focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card`}
                    >
                      <option value="">Select country</option>
                      {africanCountries.map((country: any) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.country}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                      City / Town <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="cityTown"
                      type="text"
                      value={formData.cityTown}
                      onChange={handleChange}
                      className={`block w-full h-[54px] rounded-xl border-0 px-5 text-base text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.cityTown ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/10 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-brand-dark-card focus:bg-white dark:focus:bg-brand-dark-card`}
                      placeholder="Lagos"
                    />
                    {errors.cityTown && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.cityTown}</p>}
                  </div>
                </div>
              </section>

              {/* 4. Professional Details */}
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-purple mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-brand-purple text-white flex items-center justify-center text-[10px]">4</span>
                  Professional
                </h3>
                
                <div className="mb-6">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 ml-1">
                    Professions (Select all that apply) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white dark:bg-brand-dark-card border border-brand-purple/10">
                    {musicProfessions.map((prof: any) => (
                      <button
                        key={prof}
                        type="button"
                        onClick={() => toggleProfession(prof)}
                        className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                          selectedProfessions.includes(prof)
                            ? 'bg-brand-purple text-white shadow-glow'
                            : 'bg-brand-gray dark:bg-brand-black text-gray-500 dark:text-gray-400 border border-brand-gray dark:border-white/5 hover:border-brand-purple/30'
                        }`}
                      >
                        {selectedProfessions.includes(prof) && <Check className="w-3 h-3" />}
                        {prof}
                      </button>
                    ))}
                  </div>
                  {errors.professions && <p className="mt-2 text-xs font-bold text-red-600 ml-1">{errors.professions}</p>}
                </div>
              </section>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full h-[54px] justify-center items-center rounded-xl bg-brand-purple text-white text-sm font-black uppercase tracking-widest shadow-glow hover:bg-brand-purple-dark transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  state={state}
                  className="text-brand-purple hover:text-brand-purple-hover transition-colors"
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
