import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-full focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95";
  
  const variants = {
    primary: "border-transparent text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 shadow-lg shadow-brand-500/40 hover:shadow-brand-500/60",
    secondary: "border-transparent text-brand-700 bg-brand-50 hover:bg-brand-100",
    outline: "border border-gray-200 text-gray-700 bg-transparent hover:bg-gray-50 hover:border-gray-300",
    white: "border-transparent text-brand-700 bg-white hover:bg-gray-50 shadow-md",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;