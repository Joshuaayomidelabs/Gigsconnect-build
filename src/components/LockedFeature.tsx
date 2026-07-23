import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LockedFeatureProps {
  title: string;
  description: string;
  requiredPlan?: string;
}

export const LockedFeature: React.FC<LockedFeatureProps> = ({ 
  title, 
  description, 
  requiredPlan = 'Pro' 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-brand-dark-card border-2 border-dashed border-gray-200 dark:border-[#27272A] rounded-[2rem] max-w-lg mx-auto">
      <div className="w-16 h-16 bg-brand-purple/10 flex items-center justify-center rounded-2xl mb-6">
        <Lock className="w-8 h-8 text-brand-purple" />
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-brand-black dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
        {description} This feature is available on <span className="font-bold text-brand-purple">{requiredPlan}</span> and above.
      </p>
      <button
        onClick={() => navigate('/#pricing-section')}
        className="px-8 py-3 bg-brand-black dark:bg-white text-white dark:text-brand-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
      >
        Upgrade to {requiredPlan}
      </button>
    </div>
  );
};
