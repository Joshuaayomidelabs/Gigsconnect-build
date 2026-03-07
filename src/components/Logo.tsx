import React from 'react';
import { LOGO_URL } from '../utils/constants';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'color' | 'white';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  iconClassName = '', 
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Image Logo */}
      <div className={`relative flex-shrink-0 ${iconClassName}`}>
        <img 
          src={LOGO_URL}
          alt="GigsConnect Logo" 
          className="w-10 h-10 rounded-full object-cover border-2 border-linktree-dark"
        />
      </div>
    </div>
  );
};

export default Logo;