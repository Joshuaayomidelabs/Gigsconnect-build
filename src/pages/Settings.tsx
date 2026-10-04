import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Bell,
  Palette, 
  Shield,
  UserX, 
  HelpCircle, 
  Scale, 
  LogOut, 
  AlertTriangle,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

import AccountSection from '../components/settings/AccountSection';
import SubscriptionSection from '../components/settings/SubscriptionSection';
import NotificationsSection from '../components/settings/NotificationsSection';
import AppearanceSection from '../components/settings/AppearanceSection';
import PrivacySection from '../components/settings/PrivacySection';
import BlockedUsersSection from '../components/settings/BlockedUsersSection';
import SafetyAndHelpSection from '../components/settings/SafetyAndHelpSection';
import LegalSection from '../components/settings/LegalSection';
import SessionSection from '../components/settings/SessionSection';
import DangerZoneSection from '../components/settings/DangerZoneSection';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  danger?: boolean;
}

interface SettingGroup {
  title: string;
  items: SettingItem[];
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    title: 'ACCOUNT',
    items: [
      {
        id: 'account',
        label: 'Account Settings',
        description: 'Login email, password, and credentials',
        icon: User,
      },
      {
        id: 'subscription',
        label: 'Subscription',
        description: 'Manage creator tier, badges, and billing',
        icon: CreditCard,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        description: 'Choose which updates and alerts you receive',
        icon: Bell,
      },
      {
        id: 'appearance',
        label: 'Appearance',
        description: 'Light, dark, and system themes',
        icon: Palette,
      },
    ],
  },
  {
    title: 'PRIVACY AND SAFETY',
    items: [
      {
        id: 'privacy',
        label: 'Privacy',
        description: 'Control who can message you directly',
        icon: Shield,
      },
      {
        id: 'blocked-users',
        label: 'Blocked Users',
        description: 'Manage creators you have blocked',
        icon: UserX,
      },
      {
        id: 'safety',
        label: 'Safety and Help',
        description: 'Guides, FAQs, safety center, and support',
        icon: HelpCircle,
      },
    ],
  },
  {
    title: 'ABOUT',
    items: [
      {
        id: 'legal',
        label: 'Legal',
        description: 'Terms of service, privacy, and policies',
        icon: Scale,
      },
    ],
  },
  {
    title: 'ACTIONS',
    items: [
      {
        id: 'session',
        label: 'Log out',
        description: 'Sign out of your active browser session',
        icon: LogOut,
      },
      {
        id: 'danger-zone',
        label: 'Delete account',
        description: 'Permanently remove your account and all data',
        icon: AlertTriangle,
        danger: true,
      },
    ],
  },
];

export const Settings: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const sectionParam = searchParams.get('section');
  const normalizedSection = sectionParam === 'blocked' ? 'blocked-users' : sectionParam;
  // On desktop, default to 'account' if no section is selected
  const activeSectionDesktop = normalizedSection || 'account';

  const selectSection = (id: string) => {
    setSearchParams({ section: id });
  };

  const clearSectionMobile = () => {
    navigate('/settings');
  };

  if (loading || !user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <SEO title="Settings | GigsConnect" noindex={true} />
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'account':
        return <AccountSection user={user} />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'notifications':
        return <NotificationsSection userId={user.id} />;
      case 'appearance':
        return <AppearanceSection />;
      case 'privacy':
        return <PrivacySection userId={user.id} />;
      case 'blocked':
      case 'blocked-users':
        return <BlockedUsersSection userId={user.id} />;
      case 'safety':
        return <SafetyAndHelpSection />;
      case 'legal':
        return <LegalSection />;
      case 'session':
        return <SessionSection />;
      case 'danger-zone':
        return <DangerZoneSection userId={user.id} />;
      default:
        return <AccountSection user={user} />;
    }
  };

  const getSectionTitle = (id: string) => {
    const targetId = id === 'blocked' ? 'blocked-users' : id;
    for (const group of SETTING_GROUPS) {
      const match = group.items.find(item => item.id === targetId);
      if (match) return match.label;
    }
    return 'Settings';
  };

  return (
    <div className="pt-main pb-32 sm:pb-36 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen">
      <SEO title="Settings | GigsConnect" noindex={true} />

      {/* Page Header (Desktop always, Mobile only on Level 1 menu) */}
      <div className={`${sectionParam ? 'hidden md:block' : 'block'} mb-6 sm:mb-8`}>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-purple" />
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Manage your account and preferences
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW (screens below md)                                         */}
      {/* ========================================================================= */}
      <div className="block md:hidden">
        {normalizedSection ? (
          /* Level 2: Selected Section View with Sticky Back Navigation */
          <div>
            <div className="sticky top-16 z-20 -mx-4 px-4 py-2.5 mb-5 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md border-b border-gray-100 dark:border-[#27272A] flex items-center justify-between">
              <button
                onClick={clearSectionMobile}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-purple transition-colors cursor-pointer py-1 pr-3"
              >
                <ArrowLeft className="w-4 h-4 text-brand-purple shrink-0" />
                <span>Settings</span>
              </button>
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate max-w-[180px]">
                {getSectionTitle(normalizedSection)}
              </span>
            </div>

            <div className="animate-in fade-in-50 duration-200">
              {renderSectionContent(normalizedSection)}
            </div>
          </div>
        ) : (
          /* Level 1: Menu List grouped in clean cards */
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            {SETTING_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 mb-1.5">
                  {group.title}
                </div>
                <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-100 dark:border-[#27272A] shadow-xs overflow-hidden divide-y divide-gray-100 dark:divide-[#27272A]">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectSection(item.id)}
                        className="w-full min-h-[56px] py-3.5 px-4 flex items-center justify-between text-left transition-colors hover:bg-gray-50/80 dark:hover:bg-[#18181B] active:bg-gray-100 dark:active:bg-[#202025] cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 pr-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              item.danger
                                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                                : 'bg-gray-100/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 group-hover:text-brand-purple group-hover:bg-brand-purple/10 transition-colors'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`text-sm font-bold truncate ${
                                item.danger
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors'
                              }`}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5 font-normal">
                              {item.description}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW (screens md and above): Side-by-side single active section */}
      {/* ========================================================================= */}
      <div className="hidden md:flex gap-8 items-start">
        {/* Left Sidebar Menu */}
        <aside className="w-64 shrink-0 sticky top-24">
          <nav className="bg-white dark:bg-brand-dark-card rounded-2xl p-2.5 border border-gray-100 dark:border-[#27272A] shadow-xs space-y-4">
            {SETTING_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-1">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSectionDesktop === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => selectSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          isActive
                            ? item.danger
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-xs'
                              : 'bg-brand-purple text-white shadow-xs shadow-brand-purple/20'
                            : item.danger
                              ? 'text-red-600 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-950/20'
                              : 'text-gray-600 dark:text-gray-400 hover:text-brand-black dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-[#18181B]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Right Active Section Container */}
        <main className="flex-1 w-full max-w-4xl">
          {renderSectionContent(activeSectionDesktop)}
        </main>
      </div>
    </div>
  );
};

export default Settings;
