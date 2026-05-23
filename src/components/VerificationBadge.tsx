import React from 'react';
import { Check, Clock } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified?: boolean; // Kept for backwards compatibility in type, but ignored
  verificationStatus?: string;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  isVerified, 
  verificationStatus,
  className = ''
}) => {
  const normalizedStatus = verificationStatus?.toLowerCase() || 'none';

  if (normalizedStatus === 'verified') {
    return (
      <div 
        className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand-purple ml-1.5 shrink-0 ${className}`}
        title="Verified User"
      >
        <Check className="w-3 h-3 text-white stroke-[3]" />
      </div>
    );
  }

  if (normalizedStatus === 'pending') {
    return (
      <div 
        className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-yellow-500 ml-1.5 shrink-0 ${className}`}
        title="Verification in review"
      >
        <Clock className="w-3 h-3 text-white stroke-[3]" />
      </div>
    );
  }

  return null;
};

export default VerificationBadge;
