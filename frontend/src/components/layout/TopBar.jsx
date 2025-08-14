import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AppleButton } from '../ui';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings,
  User
} from 'lucide-react';

const TopBar = ({ onMenuClick, onSearchClick }) => {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <AppleButton
            variant="ghost"
            size="small"
            icon={Menu}
            onClick={onMenuClick}
            className="lg:hidden"
          />
          <AppleButton
            variant="ghost"
            size="small"
            icon={Search}
            onClick={onSearchClick}
          >
            Search...
          </AppleButton>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          <AppleButton
            variant="ghost"
            size="small"
            icon={Bell}
          />
          <AppleButton
            variant="ghost"
            size="small"
            icon={Settings}
          />
          <div className="flex items-center space-x-3 border-l pl-4 ml-4">
            <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
            <AppleButton
              variant="ghost"
              size="small"
              icon={User}
              onClick={logout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
