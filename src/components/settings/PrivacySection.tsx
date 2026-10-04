import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Users, UserCheck, Info } from 'lucide-react';
import { settingsService, UserSettings, DEFAULT_USER_SETTINGS } from '../../services/settingsService';
import { toast } from 'sonner';

interface PrivacySectionProps {
  userId: string;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({ userId }) => {
  const [whoCanMessage, setWhoCanMessage] = useState<'everyone' | 'following'>('everyone');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await settingsService.getSettings(userId);
      if (error) {
        console.warn('Could not load user privacy settings, using defaults:', error);
      }
      if (data) {
        setWhoCanMessage(data.who_can_message || 'everyone');
      }
    } catch (err) {
      console.error('Failed to load privacy settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSelectOption = async (option: 'everyone' | 'following') => {
    if (option === whoCanMessage) return;

    const previousValue = whoCanMessage;
    // Optimistic update
    setWhoCanMessage(option);

    try {
      const { error } = await settingsService.updateSettings(userId, { who_can_message: option });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Failed to update who_can_message:', err);
      // Revert optimistic update
      setWhoCanMessage(previousValue);
      toast.error('Failed to update privacy setting. Please try again.');
    }
  };

  const options = [
    {
      id: 'everyone' as const,
      title: 'Everyone',
      description: 'Any registered creator or client can message you directly',
      icon: Users,
    },
    {
      id: 'following' as const,
      title: 'Only people I follow',
      description: 'Restrict direct messages strictly to users that you follow',
      icon: UserCheck,
    },
  ];

  return (
    <section id="privacy-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Privacy</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Control who can reach out and start direct conversations with you.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 py-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50/60 dark:bg-[#141418] animate-pulse h-16"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              Who can message me
            </h3>

            <div className="space-y-3">
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = whoCanMessage === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group min-h-[56px] select-none ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple/5 dark:bg-brand-purple/10 shadow-xs ring-1 ring-brand-purple/20'
                        : 'border-gray-100 dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#141418] hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-brand-purple text-white border-brand-purple'
                            : 'bg-white dark:bg-[#1A1A20] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800 group-hover:text-brand-purple'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-brand-purple dark:text-brand-purple-light' : 'text-brand-black dark:text-brand-white'}`}>
                          {opt.title}
                        </div>
                        <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 font-normal">
                          {opt.description}
                        </div>
                      </div>
                    </div>

                    {/* Radio circle at least 44px touch area */}
                    <div className="w-11 h-11 flex items-center justify-center shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-brand-purple bg-brand-purple'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gray-50/80 dark:bg-[#141418] border border-gray-150 dark:border-[#27272A] flex items-start gap-3">
            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              People you have blocked can never message you.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PrivacySection;
