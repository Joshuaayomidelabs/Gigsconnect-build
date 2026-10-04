import React from 'react';
import { Sun, Moon, Laptop, Palette, Check } from 'lucide-react';
import { useDarkMode, ThemeMode } from '../../context/DarkModeContext';

export const AppearanceSection: React.FC = () => {
  const { theme, setTheme } = useDarkMode();

  const options: { id: ThemeMode; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'light',
      label: 'Light',
      description: 'Clean bright layout with crisp borders',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'High contrast dark theme that saves battery',
      icon: Moon,
    },
    {
      id: 'system',
      label: 'System',
      description: 'Automatically synchronizes with your device settings',
      icon: Laptop,
    },
  ];

  return (
    <section id="appearance-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Appearance</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Choose how GigsConnect looks on your display.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-purple bg-brand-purple/5 dark:bg-brand-purple/10 shadow-sm ring-2 ring-brand-purple/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-[#FAFAFA] dark:bg-[#141418]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-brand-purple text-white shadow-sm shadow-brand-purple/30'
                      : 'bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <h3 className={`text-sm font-bold mb-1 ${isSelected ? 'text-brand-purple dark:text-brand-purple-light' : 'text-brand-black dark:text-brand-white'}`}>
                  {opt.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
export default AppearanceSection;
