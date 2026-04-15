import React from 'react';
import { Check } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified?: boolean;
  verificationStatus?: string;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  isVerified, 
  verificationStatus,
  className = ''
}) => {
  const showBadge = isVerified === true || verificationStatus?.toLowerCase() === 'verified';

  if (!showBadge) return null;

  return (
    <div 
      className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand-purple ml-1.5 shrink-0 ${className}`}
      title="Verified User"
    >
      <Check className="w-3 h-3 text-white stroke-[3]" />
    </div>
  );
};

export default VerificationBadge;
