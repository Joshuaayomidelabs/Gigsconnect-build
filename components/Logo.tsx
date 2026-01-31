import React from 'react';

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
  const iconColor = isWhite ? 'text-white' : 'text-brand-700';
  const innerColor = isWhite ? 'fill-gray-900' : 'fill-white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
       {/* Custom SVG Icon based on the provided logo style */}
       <div className={`relative flex-shrink-0 ${iconClassName}`}>
         <svg 
            width="40" 
            height="40" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={iconColor}
         >
            {/* Outer Circle */}
            <circle cx="50" cy="50" r="50" fill="currentColor" />
            
            {/* Inner stylized compass/eye shape */}
            <path 
                d="M50 15C50 15 65 35 85 50C65 65 50 85 50 85C50 85 35 65 15 50C35 35 50 15 50 15Z" 
                className={innerColor}
            />
            {/* Center dot/hole */}
            <circle cx="50" cy="50" r="12" fill="currentColor" />
            {/* Diagonal cut to match the dynamic feel */}
            <path d="M50 15 L 85 50" stroke="currentColor" strokeWidth="0" />
         </svg>
       </div>
       
       <span className={`text-2xl font-bold tracking-tight font-display ${textColor} ${textClassName}`}>
         GigsConnect
       </span>
    </div>
  );
};

export default Logo;