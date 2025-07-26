import React from 'react';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
};

export function Button({
  type = 'button',
  children,
  disabled = false,
  isLoading = false,
  className = '',
  icon,
  variant = 'primary',
  onClick,
}: ButtonProps) {
  const baseStyles = "relative w-full flex justify-center py-4 px-6 border text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantStyles = {
    primary: "text-white bg-gradient-to-r from-primary-accent to-blue-600 hover:from-primary-dark hover:to-blue-700 border-transparent",
    secondary: "text-gray-800 bg-gray-100 hover:bg-gray-200 border-gray-300",
    outline: "text-primary-accent bg-transparent hover:bg-primary-50 border-primary-accent"
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </div>
      ) : (
        <>
          {icon && <span className="absolute left-0 inset-y-0 flex items-center pl-4">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
} 