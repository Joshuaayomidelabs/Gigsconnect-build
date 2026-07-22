import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface PremiumBadgeProps {
  planName?: string;
  className?: string;
  showIcon?: boolean;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  planName = 'Starter', 
  className = '',
  showIcon = true
}) => {
  const nameLower = planName.toLowerCase();
  
  if (nameLower === 'premium') {
    return (
      <span title="Premium Creator" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 border border-yellow-300 shadow-sm ${className}`}>
        {showIcon && <span className="text-xs">👑</span>}
        {planName}
      </span>
    );
  }
  
  if (nameLower === 'pro') {
    return (
      <span title="Pro Creator" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shadow-sm ${className}`}>
        {showIcon && <span className="text-xs">⭐</span>}
        {planName}
      </span>
    );
  }

  // Starter / Free
  return (
    <span title="Starter Creator" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-[#27272A] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#3F3F46] shadow-sm ${className}`}>
      {showIcon && <CreditCard className="w-3 h-3" />}
      {planName}
    </span>
  );
};
