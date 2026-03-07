import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SubscriptionBadgeProps {
  plan?: string;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ plan }) => {
  if (!plan || plan === 'free') return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
      <CheckCircle className="w-3 h-3 fill-blue-500/10" />
      {plan}
    </div>
  );
};

export default SubscriptionBadge;
