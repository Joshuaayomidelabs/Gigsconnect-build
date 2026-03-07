import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Check, Eye, EyeOff, Music, MapPin, User, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { africanCountries, getStatesForCountry, musicProfessions, experienceLevels } from '../utils/locations';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      // Success! Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setSupabaseError(error.message || 'An error occurred during signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Decorative SVGs */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-32 h-32 text-gray-400 opacity-10 absolute top-10 left-10 -rotate-12 hidden md:block pointer-events-none">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-40 h-40 text-gray-400 opacity-10 absolute bottom-20 right-10 rotate-12 hidden md:block pointer-events-none">
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
      </svg>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            GigsConnect
          </h1>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your complete profile
        </h2>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white px-6 py-10 shadow-xl sm:rounded-3xl sm:px-12 border border-gray-100">
          
          {supabaseError && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start">
              <span className="block sm:inline">{supabaseError}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* 1. Account Information */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">1. Account Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 pl-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ${errors.password ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 pl-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ${errors.confirmPassword ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Personal Information */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">2. Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.fullName ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    Stage Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="stageName"
                      type="text"
                      value={formData.stageName}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors"
                      placeholder="DJ Apollo"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.phoneNumber ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors`}
                      placeholder="+234 800 000 0000"
                    />
                    {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Location */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">3. Location</h3>
              </div>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.country ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors`}
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
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    State / Region <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <select
                      name="stateRegion"
                      value={formData.stateRegion}
                      onChange={handleChange}
                      disabled={!formData.country}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.stateRegion ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  <label className="block text-sm font-bold leading-6 text-gray-700">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      name="cityTown"
                      type="text"
                      value={formData.cityTown}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.cityTown ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors`}
                      placeholder="Lagos"
                    />
                    {errors.cityTown && <p className="mt-1 text-xs text-red-600">{errors.cityTown}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Professional Details */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">4. Professional Details</h3>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-bold leading-6 text-gray-700 mb-2">
                  Professions (Select all that apply) <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
                  {musicProfessions.map((prof: any) => (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => toggleProfession(prof)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                        selectedProfessions.includes(prof)
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300 hover:bg-brand-50'
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
                <label className="block text-sm font-bold leading-6 text-gray-700">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.experienceLevel ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-200 focus:ring-brand-600'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-gray-50 focus:bg-white transition-colors`}
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
                className="flex w-full justify-center items-center rounded-xl bg-brand-600 px-3 py-4 text-base font-bold leading-6 text-white shadow-md hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
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

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-brand-600 hover:text-brand-500 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
