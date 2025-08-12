// frontend/src/components/ui/AppleInput.jsx
import React from 'react';

const AppleInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  icon: Icon,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default AppleInput;