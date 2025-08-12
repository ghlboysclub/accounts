import React from 'react';

const LoadingSpinner = ({ size = 'lg', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};

// Button Spinner Component - FIXED EXPORT
export const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4', 
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${sizeClasses[size]} ${className}`}></div>
  );
};

// Table Skeleton Component  
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 flex items-center space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`h-4 bg-gray-200 rounded animate-pulse ${
                  colIndex === 0 ? 'w-1/4' : 
                  colIndex === 1 ? 'w-1/3' : 
                  colIndex === 2 ? 'w-1/5' : 'w-1/6'
                }`}
                style={{
                  animationDelay: `${(rowIndex * columns + colIndex) * 100}ms`
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Card Skeleton Component
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Full screen loading component
export const FullScreenLoader = ({ message = 'Loading your account...' }) => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
      <div className="mt-4 text-sm text-gray-400">
        Please wait while we set up your workspace...
      </div>
    </div>
  </div>
);

export default LoadingSpinner;