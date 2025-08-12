import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useRole } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requireRole = null, 
  requireAnyRole = null,
  fallback = null 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { hasRole, hasAnyRole } = useRole();
  const location = useLocation();

  // Show loading spinner while authentication is being verified
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-soft border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-danger-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need <span className="font-medium text-gray-900">{requireRole}</span> role to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your current role: <span className="font-medium">{user?.role}</span>
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (requireAnyRole && !hasAnyRole(requireAnyRole)) {
    const rolesList = requireAnyRole.join(', ');
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-soft border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-danger-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need one of these roles to access this page:
          </p>
          <p className="font-medium text-gray-900 mb-2">{rolesList}</p>
          <p className="text-sm text-gray-500 mb-6">
            Your current role: <span className="font-medium">{user?.role}</span>
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Return fallback component if provided and access is denied
  if (fallback && (
    (requireRole && !hasRole(requireRole)) ||
    (requireAnyRole && !hasAnyRole(requireAnyRole))
  )) {
    return fallback;
  }

  // Render children if all checks pass
  return children;
};

// Higher-order component for role-based protection
export const withRoleProtection = (Component, requiredRole) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute requireRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Higher-order component for multi-role protection
export const withMultiRoleProtection = (Component, requiredRoles) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute requireAnyRole={requiredRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Hook for conditional rendering based on roles
export const useConditionalRender = () => {
  const { hasRole, hasAnyRole } = useRole();
  
  const renderForRole = (role, component, fallback = null) => {
    return hasRole(role) ? component : fallback;
  };
  
  const renderForAnyRole = (roles, component, fallback = null) => {
    return hasAnyRole(roles) ? component : fallback;
  };
  
  return { renderForRole, renderForAnyRole };
};

export default ProtectedRoute;