import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  BarChart3, 
  UserCheck, 
  Plus,
  ChevronRight,
  FolderOpen,
  Building2,
  CreditCard,
  FileText,
  PieChart,
  TrendingUp,
  Settings,
  User,
  Calendar,
  Banknote,
  Target,
  Briefcase,
  Shield,
  Bell
} from 'lucide-react';

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
          description: 'Track business expenses'
        },
        {
          id: 'investments',
          label: 'Investments',
          icon: TrendingUp,
          path: '/investments',
          description: 'Investment portfolio'
        },
        {
          id: 'distributions',
          label: 'Distributions',
          icon: PieChart,
          path: '/distributions',
          description: 'Profit distributions'
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
          icon: FolderOpen,
          path: '/projects',
          description: 'Project tracking'
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
          description: 'P&L, Balance Sheet, etc.'
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

export default CompleteSidebar;