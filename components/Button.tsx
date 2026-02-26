import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-full focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95";
  
  const variants = {
    primary: "border-transparent text-white bg-linktree-dark hover:bg-black shadow-sm",
    secondary: "border-transparent text-linktree-dark bg-linktree-gray hover:bg-gray-200 shadow-sm",
    outline: "border border-linktree-dark text-linktree-dark bg-transparent hover:bg-linktree-gray",
    white: "border-transparent text-linktree-dark bg-white hover:bg-gray-50 shadow-sm",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;