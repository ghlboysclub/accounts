import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu,
  X,
  Home,
  ChevronRight,
  User,
  Settings,
  LogOut,
  LayoutDashboard, 
  Receipt, 
  FileText, 
  Users, 
  BarChart3, 
  UserCheck, 
  Calendar,
  CreditCard,
  Building,
  FileBarChart,
  Banknote,
  Plus,
  TrendingUp,
  PieChart,
  Activity,
  Folder,  // Added missing import
  Shield,  // Added missing import
  Target,  // Added missing import
  Briefcase // Added missing import
} from 'lucide-react';

// Enhanced Header Component
const EnhancedHeader = ({ 
  onMobileMenuToggle,
  isMobileMenuOpen = false,
  user,
  onLogout,
  currentPath
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userDropdownRef = useRef(null);
  const notificationRef = useRef(null);
  
  const [notifications] = useState([
    { id: 1, title: "New transaction recorded", time: "5 min ago", unread: true },
    { id: 2, title: "Monthly report ready", time: "1 hour ago", unread: true },
    { id: 3, title: "Partner payment processed", time: "2 hours ago", unread: false }
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Generate breadcrumbs based on current location
  const getBreadcrumbs = () => {
    if (currentPath === '/dashboard') return [{ label: "Dashboard" }];
    if (currentPath === '/transactions') return [{ label: "Transactions" }];
    if (currentPath === '/partners') return [{ label: "Partners" }];
    if (currentPath === '/reports') return [{ label: "Reports" }];
    if (currentPath === '/settings') return [{ label: "Settings" }];
    if (currentPath === '/clients') return [{ label: "Clients" }];
    if (currentPath === '/analytics') return [{ label: "Analytics" }];
    if (currentPath === '/invoices') return [{ label: "Invoices" }];
    return [{ label: "Dashboard" }];
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
  };

  const handleLogout = () => {
    onLogout();
    setIsUserDropdownOpen(false);
  };

  const breadcrumbs = getBreadcrumbs();
  const currentUser = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@ghlboysclub.com"
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section: Mobile Menu + Logo */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900">Accounts</h1>
                <p className="text-xs text-gray-500 -mt-1">GHL Boys Club</p>
              </div>
            </div>
          </div>

          {/* Center Section: Breadcrumbs (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <Home size={16} className="text-gray-400" />
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight size={16} className="text-gray-400" />
                <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Right Section: Search + Notifications + User */}
          <div className="flex items-center space-x-4">
            
            {/* Search Bar */}
            <div className="hidden sm:block relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search transactions, clients..."
                  className="pl-9 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile Search Button */}
            <button className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (when mobile menu is open) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search transactions, clients..."
              className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </header>
  );
};

// Complete Business Sidebar Component
const CompleteSidebar = ({ 
  isCollapsed = false, 
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Complete menu structure based on your API endpoints
  const menuSections = [
    {
      id: 'overview',
      label: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard',
          description: 'Business overview & KPIs'
        }
      ]
    },
    {
      id: 'finance',
      label: 'FINANCE',
      items: [
        {
          id: 'transactions',
          label: 'Transactions',
          icon: Receipt,
          path: '/transactions',
          badge: { count: 'New', color: 'bg-blue-500' },
          description: 'All financial transactions'
        },
        {
          id: 'expenses',
          label: 'Expenses',
          icon: CreditCard,
          path: '/expenses',
          description: 'Track business expenses',
          comingSoon: true
        },
        {
          id: 'investments',
          label: 'Investments',
          icon: TrendingUp,
          path: '/investments',
          description: 'Investment portfolio',
          comingSoon: true
        },
        {
          id: 'distributions',
          label: 'Distributions',
          icon: PieChart,
          path: '/distributions',
          description: 'Profit distributions',
          comingSoon: true
        }
      ]
    },
    {
      id: 'business',
      label: 'BUSINESS',
      items: [
        {
          id: 'clients',
          label: 'Clients',
          icon: Users,
          path: '/clients',
          description: 'Client management'
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: Folder,
          path: '/projects',
          description: 'Project tracking',
          comingSoon: true
        },
        {
          id: 'partners',
          label: 'Partners',
          icon: UserCheck,
          path: '/partners',
          description: 'Partner management'
        }
      ]
    },
    {
      id: 'reports',
      label: 'REPORTS & ANALYTICS',
      items: [
        {
          id: 'reports',
          label: 'Financial Reports',
          icon: FileText,
          path: '/reports',
          description: 'P&L, Balance Sheet, etc.',
          comingSoon: true
        },
        {
          id: 'analytics',
          label: 'Business Analytics',
          icon: BarChart3,
          path: '/analytics',
          description: 'Advanced analytics'
        }
      ]
    },
    {
      id: 'tools',
      label: 'TOOLS',
      items: [
        {
          id: 'calendar',
          label: 'Calendar',
          icon: Calendar,
          path: '/calendar',
          comingSoon: true,
          description: 'Schedule & meetings'
        },
        {
          id: 'banking',
          label: 'Banking',
          icon: Banknote,
          path: '/banking',
          comingSoon: true,
          description: 'Bank connections'
        },
        {
          id: 'advances',
          label: 'Advances',
          icon: Target,
          path: '/advances',
          comingSoon: true,
          description: 'Advance payments'
        }
      ]
    },
    {
      id: 'admin',
      label: 'ADMINISTRATION',
      items: [
        {
          id: 'users',
          label: 'User Management',
          icon: Shield,
          path: '/users',
          comingSoon: true,
          description: 'Manage system users',
          adminOnly: true
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          path: '/settings',
          comingSoon: true,
          description: 'System configuration'
        }
      ]
    }
  ];

  const handleItemClick = (item) => {
    if (!item.comingSoon) {
      navigate(item.path);
      if (isMobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    }
  };

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    
    return (
      <li key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          disabled={item.comingSoon}
          className={`
            w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md
            transition-all duration-150 ease-in-out group relative
            ${isActive 
              ? 'bg-blue-50 text-blue-700 shadow-sm border-r-2 border-blue-600' 
              : item.comingSoon
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
          title={isCollapsed ? item.label : item.description}
        >
          <item.icon 
            size={20}
            className={`
              flex-shrink-0
              ${isCollapsed ? 'mx-auto' : 'mr-3'}
              ${isActive ? 'text-blue-600' : item.comingSoon ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-700'}
            `}
          />
          {!isCollapsed && (
            <>
              <div className="flex-1 text-left">
                <div className="flex items-center">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      inline-flex items-center px-1.5 py-0.5 ml-2 text-xs font-medium 
                      text-white rounded ${item.badge.color}
                    `}>
                      {item.badge.count}
                    </span>
                  )}
                  {item.comingSoon && (
                    <span className="inline-flex items-center px-1.5 py-0.5 ml-2 text-xs font-medium text-amber-700 bg-amber-100 rounded">
                      Soon
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    {item.description}
                  </div>
                )}
              </div>
            </>
          )}
        </button>
      </li>
    );
  };

  const renderSection = (section) => {
    return (
      <div key={section.id} className="mb-6">
        {!isCollapsed && (
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {section.label}
          </h3>
        )}
        <ul className="space-y-1">
          {section.items.map(item => renderMenuItem(item))}
        </ul>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
        transform transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:border-r
        ${isCollapsed ? 'w-16' : 'w-72'}
        flex flex-col
      `}>
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">Accounts</h1>
                <p className="text-xs text-gray-500">GHL Boys Club</p>
              </div>
            </div>
          )}
          
          {/* Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronRight 
              size={16} 
              className={`transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-100">
            <button className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm">
              <Plus size={18} className="mr-2" />
              New Transaction
            </button>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                <Receipt size={14} className="mr-1" />
                Expense
              </button>
              <button className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                <Users size={14} className="mr-1" />
                Client
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav 
          className="flex-1 px-3 py-4 space-y-2"
          style={{ 
            overflowY: 'auto',
            overscrollBehavior: 'contain'
          }}
        >
          {menuSections.map(section => renderSection(section))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100">
            {/* Revenue Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-900">Total Revenue</p>
                  <p className="text-lg font-bold text-green-600">₨976.5K</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-600">This Year</span>
                <span className="text-green-600 font-medium">+12.5%</span>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">GHL Boys Club</p>
                <p className="text-xs text-gray-500 truncate">4 Active Partners</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Main Layout Component
const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Complete Business Sidebar */}
      <CompleteSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        isMobileOpen={sidebarOpen}
        onCloseMobile={closeSidebar}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Enhanced Header */}
        <EnhancedHeader 
          onMobileMenuToggle={toggleSidebar}
          isMobileMenuOpen={sidebarOpen}
          user={user}
          onLogout={logout}
          currentPath={location.pathname}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;