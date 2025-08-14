import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Apple, ArrowRight } from 'lucide-react';
import { AppleButton, AppleInput } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';  // Fixed import path

const AppleLoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center">
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Apple className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="px-8 pb-8 space-y-6">
            {/* Email Input */}
            <AppleInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              icon={Mail}
              placeholder="Enter your email"
              required
            />

            {/* Password Input */}
            <AppleInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              icon={Lock}
              placeholder="Enter your password"
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              
              <AppleButton
                type="button"
                variant="ghost"
                size="small"
                className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Forgot password?
              </AppleButton>
            </div>

            {/* Login Button */}
            <AppleButton
              onClick={handleSubmit}
              disabled={isLoading}
              variant="primary"
              icon={ArrowRight}
              className="w-full"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </AppleButton>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <AppleButton
                type="button"
                variant="secondary"
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-200"
              >
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </AppleButton>
              
              <AppleButton
                type="button"
                variant="secondary"
                icon={Apple}
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-200"
              >
                <span className="text-sm font-medium text-gray-700">Apple</span>
              </AppleButton>
            </div>
          </div>

          {/* Sign Up Link - Updated styling */}
          <div className="text-center border-t border-gray-100">
            <div className="px-8 py-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <AppleButton 
                  variant="ghost" 
                  size="small" 
                  className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                >
                  Sign up
                </AppleButton>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleLoginPage;