import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { africanCountries, getStatesForCountry, musicProfessions, experienceLevels } from '../utils/locations';
import Logo from '../components/Logo';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    from?: string;
    message?: string;
  } | null;

  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    country: '',
    stateRegion: '',
    cityTown: '',
    experienceLevel: '',
  });
  
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.country) {
      const states = getStatesForCountry(formData.country);
      setAvailableStates(states);
      setFormData(prev => ({ ...prev, stateRegion: '' })); // Reset state when country changes
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
    if (!formData.stateRegion) newErrors.stateRegion = 'State/Region is required';
    if (!formData.cityTown.trim()) newErrors.cityTown = 'City/Town is required';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience Level is required';
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

      // 2. Insert into profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: formData.fullName,
          role: selectedProfessions[0] || 'Musician',
          skills: selectedProfessions,
          country: formData.country,
          city: formData.cityTown,
        });

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
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Decorative SVGs */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-32 h-32 text-brand-purple opacity-5 absolute top-10 left-10 -rotate-12 hidden md:block pointer-events-none">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-40 h-40 text-brand-purple opacity-5 absolute bottom-20 right-10 rotate-12 hidden md:block pointer-events-none">
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
      </svg>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <Logo iconClassName="w-10 h-10" />
          <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tighter">
            Gigs<span className="text-brand-purple">Connect</span>
          </h1>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-brand-black dark:text-brand-white">
          Create your complete profile
        </h2>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-brand-white dark:bg-brand-dark-card px-6 py-10 shadow-xl sm:rounded-3xl sm:px-12 border border-brand-purple/10">
          
          {state?.message && (
            <div className="mb-6 p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/20 text-brand-purple text-sm text-center font-medium shadow-sm">
              {state.message}
            </div>
          )}

          {supabaseError && (
            <div className="mb-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/40 flex items-start">
              <span className="block sm:inline">{supabaseError}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* 1. Account Information */}
            <div>
              <h3 className="text-lg font-bold text-brand-black dark:text-brand-white border-b border-brand-gray dark:border-gray-700 pb-2 mb-4">1. Account Information</h3>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.password ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.confirmPassword ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-brand-black dark:text-brand-white border-b border-brand-gray dark:border-gray-700 pb-2 mb-4">2. Personal Information</h3>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.fullName ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    Stage Name <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="stageName"
                      type="text"
                      value={formData.stageName}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ring-brand-purple/20 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-purple sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors"
                      placeholder="DJ Apollo"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.phoneNumber ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                      placeholder="+234 800 000 0000"
                    />
                    {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Location */}
            <div>
              <h3 className="text-lg font-bold text-brand-black dark:text-brand-white border-b border-brand-gray dark:border-gray-700 pb-2 mb-4">3. Location</h3>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.country ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                    >
                      <option value="">Select a country</option>
                      {africanCountries.map((country: any) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    State / Region <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <select
                      name="stateRegion"
                      value={formData.stateRegion}
                      onChange={handleChange}
                      disabled={!formData.country}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.stateRegion ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select a state/region</option>
                      {availableStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.stateRegion && <p className="mt-1 text-xs text-red-600">{errors.stateRegion}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="cityTown"
                      type="text"
                      value={formData.cityTown}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.cityTown ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                      placeholder="Lagos"
                    />
                    {errors.cityTown && <p className="mt-1 text-xs text-red-600">{errors.cityTown}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Professional Details */}
            <div>
              <h3 className="text-lg font-bold text-brand-black dark:text-brand-white border-b border-brand-gray dark:border-gray-700 pb-2 mb-4">4. Professional Details</h3>
              
              <div className="mb-5">
                <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300 mb-2">
                  Professions (Select all that apply) <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-60 overflow-y-auto p-2 border border-brand-purple/20 rounded-xl bg-brand-gray dark:bg-brand-black">
                  {musicProfessions.map((prof: any) => (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => toggleProfession(prof)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                        selectedProfessions.includes(prof)
                          ? 'bg-brand-purple text-brand-white shadow-sm'
                          : 'bg-brand-white dark:bg-brand-dark-card text-brand-black dark:text-gray-300 border border-brand-purple/30 hover:border-brand-purple hover:bg-brand-purple/5'
                      }`}
                    >
                      {selectedProfessions.includes(prof) && <Check className="w-3.5 h-3.5" />}
                      {prof}
                    </button>
                  ))}
                </div>
                {errors.professions && <p className="mt-1 text-xs text-red-600">{errors.professions}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold leading-6 text-brand-black dark:text-gray-300">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-0 py-3 px-4 text-brand-black dark:text-brand-white shadow-sm ring-1 ring-inset ${errors.experienceLevel ? 'ring-red-300 focus:ring-red-500' : 'ring-brand-purple/20 focus:ring-brand-purple'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card transition-colors`}
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map((level: any) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.experienceLevel && <p className="mt-1 text-xs text-red-600">{errors.experienceLevel}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-xl bg-brand-purple px-3 py-4 text-base font-bold leading-6 text-brand-white shadow-md hover:bg-brand-purple-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating complete profile...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              state={state}
              className="font-semibold leading-6 text-brand-purple hover:text-brand-purple-hover transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
