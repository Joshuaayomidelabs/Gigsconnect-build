import React, { useState, useEffect, useCallback } from 'react';
import { Bell, MessageSquare, Briefcase, Heart, Sparkles, Info, Loader2 } from 'lucide-react';
import { settingsService, UserSettings, DEFAULT_USER_SETTINGS } from '../../services/settingsService';
import { toast } from 'sonner';

interface NotificationsSectionProps {
  userId: string;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ userId }) => {
  const [settings, setSettings] = useState<UserSettings>({
    user_id: userId,
    ...DEFAULT_USER_SETTINGS,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await settingsService.getSettings(userId);
      if (error) {
        console.warn('Could not load user settings, using defaults:', error);
      }
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load notification settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggle = async (key: keyof Omit<UserSettings, 'user_id' | 'who_can_message' | 'updated_at'>) => {
    const previousValue = settings[key];
    const newValue = !previousValue;

    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      const { error } = await settingsService.updateSettings(userId, { [key]: newValue });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error(`Failed to update ${key}:`, err);
      // Revert optimistic update
      setSettings(prev => ({ ...prev, [key]: previousValue }));
      toast.error('Failed to update notification setting. Please try again.');
    }
  };

  const notificationItems = [
    {
      key: 'notify_messages' as const,
      title: 'Messages',
      description: 'New direct messages from clients and creators',
      icon: MessageSquare,
    },
    {
      key: 'notify_applications' as const,
      title: 'Applications',
      description: 'Applications and application updates on my gigs',
      icon: Briefcase,
    },
    {
      key: 'notify_social' as const,
      title: 'Community activity',
      description: 'Follows, likes and comments on your activity',
      icon: Heart,
    },
    {
      key: 'notify_gigs' as const,
      title: 'New gigs',
      description: 'Alerts when new gigs are posted',
      icon: Sparkles,
    },
  ];

  return (
    <section id="notifications-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Notifications</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Choose which updates and alerts you receive.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 py-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/60 dark:bg-[#141418] animate-pulse">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-7 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0 ml-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {notificationItems.map(item => {
            const Icon = item.icon;
            const isChecked = settings[item.key];

            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key)}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-gray-100 dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#141418] hover:border-brand-purple/30 dark:hover:border-brand-purple/30 transition-all cursor-pointer group select-none min-h-[56px]"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1A1A20] text-gray-600 dark:text-gray-300 group-hover:text-brand-purple group-hover:bg-brand-purple/10 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Switch button with at least 44px touch height */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item.key);
                  }}
                  className="h-11 flex items-center justify-center shrink-0 pl-2 focus:outline-none cursor-pointer"
                >
                  <div
                    className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                      isChecked ? 'bg-brand-purple' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </div>
            );
          })}

          <div className="mt-6 p-4 rounded-2xl bg-purple-50/50 dark:bg-brand-purple/5 border border-purple-100/80 dark:border-brand-purple/20 flex items-start gap-3">
            <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              Important account and payment notices are always sent.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default NotificationsSection;
