import React from 'react';
import { CreditCard, ShieldCheck, Crown, Star } from 'lucide-react';

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
        {showIcon && <Crown className="w-3 h-3" />}
        {planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase()}
      </span>
    );
  }
  
  if (nameLower === 'pro') {
    return (
      <span title="Pro Creator" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shadow-sm ${className}`}>
        {showIcon && <Star className="w-3 h-3" />}
        {planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase()}
      </span>
    );
  }

  // Starter / Free
  if (nameLower === 'free' || nameLower === 'starter') {
    return null;
  }

  return null;
};
