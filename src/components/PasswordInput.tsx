import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showStrength?: boolean;
  strengthValue?: number; // 0-100
  strengthLabel?: string; // "Weak", "Medium", "Strong"
  leadingIcon?: React.ReactNode;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  showStrength = false,
  strengthValue = 0,
  strengthLabel = '',
  leadingIcon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getStrengthColor = () => {
    if (strengthValue < 33) return 'bg-red-500';
    if (strengthValue < 66) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {leadingIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-[#6C3BFF] transition-colors">
            {leadingIcon}
          </div>
        )}
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`block w-full h-12 sm:h-[52px] rounded-xl border-0 ${
            leadingIcon ? 'pl-11' : 'pl-4'
          } pr-12 text-sm sm:text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
            error 
              ? 'ring-red-400 focus:ring-red-500' 
              : 'ring-gray-200 dark:ring-white/10 focus:ring-[#6C3BFF] dark:focus:ring-[#6C3BFF] group-hover:ring-gray-300 dark:group-hover:ring-white/20'
          } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white dark:bg-[#141418] focus:bg-white dark:focus:bg-[#141418] ${className}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center text-gray-400 hover:text-[#6C3BFF] dark:text-gray-500 dark:hover:text-[#6C3BFF] transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 transition-transform duration-200 hover:scale-110 active:scale-95" />
          ) : (
            <Eye className="w-5 h-5 transition-transform duration-200 hover:scale-110 active:scale-95" />
          )}
        </button>
      </div>
      
      {showStrength && (
        <div className="mt-2 px-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Strength: <span className={getStrengthColor().replace('bg-', 'text-')}>{strengthLabel}</span>
            </span>
          </div>
          <div className="h-1 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`}
              style={{ width: `${strengthValue}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
          <X className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
