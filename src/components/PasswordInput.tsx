import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showStrength?: boolean;
  strengthValue?: number; // 0-100
  strengthLabel?: string; // "Weak", "Medium", "Strong"
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  showStrength = false,
  strengthValue = 0,
  strengthLabel = '',
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
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`block w-full h-[56px] rounded-[18px] border-0 pl-5 pr-12 text-base text-[#111827] shadow-sm ring-1 ring-inset ${
            error 
              ? 'ring-red-300 focus:ring-red-500' 
              : 'ring-[#E5E7EB] focus:ring-[#7C3AED] group-hover:ring-gray-300'
          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-all duration-200 bg-white focus:bg-white ${className.replace('ring-[#E5E7EB]', '').replace('bg-white', '').replace('text-[#111827]', '')}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#7C3AED] transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Strength: <span className={getStrengthColor().replace('bg-', 'text-')}>{strengthLabel}</span>
            </span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`}
              style={{ width: `${strengthValue}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-bold text-red-600 ml-1 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
