import React from 'react';
import { LOGO_URL } from '../constants';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'color' | 'white';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  iconClassName = '', 
  textClassName = '',
  variant = 'color'
}) => {
  const isWhite = variant === 'white';
  const textColor = isWhite ? 'text-white' : 'text-brand-900';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Image Logo */}
      <div className={`relative flex-shrink-0 ${iconClassName}`}>
        <img 
          src={LOGO_URL}
          alt="GigsConnect Logo" 
          className="w-10 h-10 rounded-full object-cover border-2 border-brand-500"
        />
      </div>
       
       <span className={`text-2xl font-bold tracking-tight font-display ${textColor} ${textClassName}`}>
         GigsConnect
       </span>
    </div>
  );
};

export default Logo;