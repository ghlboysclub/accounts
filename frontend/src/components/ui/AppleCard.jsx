// frontend/src/components/ui/AppleCard.jsx
import React from 'react';

const AppleCard = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false 
}) => {
  const hoverClasses = hoverable ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer" : "";
  
  return (
    <div
      className={`bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-sm transition-all duration-300 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default AppleCard;