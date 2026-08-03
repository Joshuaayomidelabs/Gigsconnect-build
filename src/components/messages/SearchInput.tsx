import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-brand-white dark:bg-brand-dark-card border border-transparent focus:border-brand-purple/20 dark:focus:border-brand-purple/20 rounded-2xl outline-none text-brand-black dark:text-brand-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all shadow-soft"
      />
    </div>
  );
};
