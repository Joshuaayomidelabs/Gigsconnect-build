import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Loader2, ArrowRight, MapPin } from 'lucide-react';
import { profilesService } from '../services/profilesService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { africanCountries, getStatesForCountry } from '../utils/locations';
import { notifyError } from '../utils/errorHandler';

const CreatorLocation: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: ''
  });
  
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      // Split city_town into City and State if they are stored as "City, State"
      let initialCity = '';
      let initialState = '';
      if (profile.city_town) {
        const parts = profile.city_town.split(',').map((p: string) => p.trim());
        if (parts.length > 1) {
          initialCity = parts[0];
          initialState = parts[1];
        } else {
          initialCity = parts[0];
        }
      }
      
      const ctry = profile.country || '';
      
      setFormData({
        country: ctry,
        state: initialState,
        city: initialCity
      });
      
      if (ctry) {
        setAvailableStates(getStatesForCountry(ctry));
      }
    }
  }, [profile]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value;
    setFormData(prev => ({ ...prev, country: c, state: '', city: '' }));
    setAvailableStates(getStatesForCountry(c));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (!formData.country || !formData.city || !formData.state) {
      notifyError('Please fill in all location fields.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Combine City and State into city_town
      const city_town = `${formData.city}, ${formData.state}`;
      
      await profilesService.updateProfile({ 
        country: formData.country,
        city: city_town
      });
      
      await refreshProfile();
      navigate('/creator-welcome', { replace: true });
    } catch (err: any) {
      console.error('Error saving location:', err);
      notifyError('Failed to save your location.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-purple/10 mb-6 text-brand-purple">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-black dark:text-brand-white mb-4 tracking-tight">
            Where are you based?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
            Add your location to discover local gigs and connect with creators near you.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2">Country</label>
              <input 
                list="countries"
                name="country"
                value={formData.country}
                onChange={handleCountryChange}
                placeholder="Search or select country"
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-black text-brand-black dark:text-brand-white outline-none focus:ring-2 focus:ring-brand-purple"
              />
              <datalist id="countries">
                {africanCountries.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {formData.country && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2">State / Region</label>
                  <input 
                    list="states"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Search or select state/region"
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-black text-brand-black dark:text-brand-white outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <datalist id="states">
                    {availableStates.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2">City</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-black text-brand-black dark:text-brand-white outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleContinue}
              disabled={isLoading || !formData.country || !formData.city || !formData.state}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreatorLocation;
