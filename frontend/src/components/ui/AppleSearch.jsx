import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Settings, FileText, Users, Calendar } from 'lucide-react';

const AppleSearch = ({ onClose, placeholder }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Command palette items
  const items = [
    { icon: FileText, name: 'Documents', shortcut: '⌘ D', href: '/documents' },
    { icon: Users, name: 'Clients', shortcut: '⌘ C', href: '/clients' },
    { icon: Calendar, name: 'Calendar', shortcut: '⌘ E', href: '/calendar' },
    { icon: Settings, name: 'Settings', shortcut: '⌘ S', href: '/settings' },
  ].filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      const selected = items[selectedIndex];
      if (selected) {
        navigate(selected.href);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [items, selectedIndex, navigate, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-200 rounded-lg">
                esc
              </kbd>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={`
                  px-4 py-3 flex items-center justify-between cursor-pointer
                  ${selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}
                `}
                onClick={() => {
                  navigate(item.href);
                  onClose();
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{item.name}</span>
                </div>
                <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded-lg">
                  {item.shortcut}
                </kbd>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppleSearch;
