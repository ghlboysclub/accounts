import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Building2 } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-lg sm:px-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* 404 Illustration */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you may have mistyped the URL.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Search className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Looking for something specific?
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Dashboard - View your financial overview</li>
                    <li>• Partners - Manage profit sharing</li>
                    <li>• Clients - Client relationship management</li>
                    <li>• Transactions - Financial transaction history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full btn btn-secondary flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If you believe this is an error, please contact the system administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 GHL Boys Club - Accounts System
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;