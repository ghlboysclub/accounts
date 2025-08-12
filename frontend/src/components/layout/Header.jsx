// LEGACY HEADER COMPONENT - KEEP AS BACKUP
// This file is replaced by the enhanced header in Layout.jsx
// Keep this file for reference or if you need to rollback

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Menu,
  X,
  Home,
  ChevronRight
} from 'lucide-react';

const Header = ({ 
  user = { name: "Admin User", email: "admin@ghlboysclub.com" },
  onLogout,
  onMenuToggle,
  isMobileMenuOpen = false,
  breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }],
  notifications = 3
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality
    }
  };

  const mockNotifications = [
    { id: 1, title: "Payment received from TechCorp", time: "2 min ago", type: "success" },
    { id: 2, title: "Monthly report ready", time: "1 hour ago", type: "info" },
    { id: 3, title: "Low account balance warning", time: "3 hours ago", type: "warning" }
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section: Logo + Mobile Menu + Breadcrumbs */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GB</span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">GHL Boys Club</h1>
                  <p className="text-xs text-gray-500">Finance Management</p>
                </div>
              </div>
            </div>

            {/* Breadcrumbs - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-2 ml-6" aria-label="Breadcrumb">
              <Home className="h-4 w-4 text-gray-400" />
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  <span className={`text-sm ${index === breadcrumbs.length - 1 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                  }`}>
                    {crumb.label}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* Center Section: Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search transactions, clients, invoices..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm"
              />
            </div>
          </div>

          {/* Right Section: Notifications + User Menu */}
          <div className="flex items-center space-x-3">
            
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                      <span className="text-sm text-gray-500">{notifications} new</span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === 'success' ? 'bg-green-400' :
                            notification.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AU'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </button>
                    
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    
                    <div className="border-t border-gray-100">
                      <button 
                        onClick={onLogout}
                        className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Shows when mobile menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 bg-gray-50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;