import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Building2, Shield, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ButtonSpinner } from '../../components/common/LoadingSpinner';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  // Clear any previous errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []); // Empty dependency array to run only once

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await login(credentials.email, credentials.password);
      
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role) => {
    if (isSubmitting) return; // Prevent multiple clicks
    
    const demoCredentials = {
      Admin: { email: 'admin@ghlboysclub.com', password: 'admin123' },
      Partner: { email: 'ahmad.ali@ghlboysclub.com', password: 'ahmad123' },
      Employee: { email: 'employee@ghlboysclub.com', password: 'employee123' }
    };

    const creds = demoCredentials[role];
    if (creds) {
      setCredentials(creds);
      setIsSubmitting(true);
      
      try {
        const result = await login(creds.email, creds.password);
        if (result.success) {
          // Navigation will be handled by the login function
          console.log('Login successful, navigating...');
        }
      } catch (err) {
        console.error('Demo login error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <Building2 className="h-12 w-12 mb-6 text-white" />
            <h1 className="text-4xl font-bold mb-4 text-shadow-lg">
              Accounts
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Enterprise Finance Management System for GHL Boys Club
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-blue-100">Real-time revenue tracking: 976,500 PKR</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-blue-100">Multi-partner profit distribution</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-blue-100">Role-based access control</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <Building2 className="h-10 w-10 mx-auto text-primary-600 mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600 mt-1">Enterprise Finance Management</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="admin@ghlboysclub.com"
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !credentials.email || !credentials.password}
                  className="w-full btn btn-primary py-3 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <ButtonSpinner />
                      <span className="ml-2">Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            {/* Demo Login Section */}
            <div className="mt-8">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Try Demo Login
              </button>
              
              {showDemo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-xs text-gray-600 mb-3">
                    Click any role to login instantly:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleDemoLogin('Admin')}
                      disabled={isSubmitting}
                      className="text-left p-3 bg-white rounded-md border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                            Admin Access
                          </p>
                          <p className="text-xs text-gray-500">
                            admin@ghlboysclub.com
                          </p>
                        </div>
                        <Shield className="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleDemoLogin('Partner')}
                      disabled={isSubmitting}
                      className="text-left p-3 bg-white rounded-md border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                            Partner Access
                          </p>
                          <p className="text-xs text-gray-500">
                            ahmad.ali@ghlboysclub.com
                          </p>
                        </div>
                        <Users className="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Production Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Production System
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Connected to live API processing real business data
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 GHL Boys Club. Built with React & Cloudflare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;