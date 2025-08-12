// frontend/src/components/ui/AppleButton.jsx
import React from 'react';

const AppleButton = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick, 
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseClasses = "font-semibold transition-all duration-200 rounded-2xl flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 focus:ring-emerald-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3",
    large: "px-8 py-4 text-lg"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default AppleButton;