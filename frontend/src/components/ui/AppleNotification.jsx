// frontend/src/components/ui/AppleNotification.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Bell
} from 'lucide-react';

const AppleNotification = ({ 
  type = 'info',
  title,
  message,
  onClose,
  visible = true,
  autoClose = true,
  duration = 5000,
  position = 'top-right',
  showIcon = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-emerald-50/90',
      borderColor: 'border-emerald-200/50',
      textColor: 'text-emerald-800',
      iconColor: 'text-emerald-500'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50/90',
      borderColor: 'border-red-200/50',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50/90',
      borderColor: 'border-amber-200/50',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50/90',
      borderColor: 'border-blue-200/50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const positions = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'top-center': 'top-6 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  const config = types[type] || types.info;
  const IconComponent = config.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed ${positions[position]} z-50 min-w-80 max-w-md
        ${config.bgColor} ${config.borderColor} backdrop-blur-2xl
        border rounded-3xl shadow-lg transition-all duration-300 ease-out
        ${isRemoving 
          ? 'transform translate-x-full opacity-0 scale-95' 
          : 'transform translate-x-0 opacity-100 scale-100'
        }
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {showIcon && IconComponent && (
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`font-semibold ${config.textColor} mb-1`}>
                  {title}
                </h4>
              )}
              <p className={`${config.textColor} text-sm leading-relaxed`}>
                {message}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ml-3 p-1 ${config.iconColor} hover:bg-white/50 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500`}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar for auto-close */}
      {autoClose && (
        <div className={`h-1 ${config.bgColor.replace('50', '100')} rounded-b-3xl overflow-hidden`}>
          <div 
            className={`h-full ${config.iconColor.replace('text', 'bg')} transition-all duration-100 ease-linear animate-progress`}
            style={{ 
              animation: `progress ${duration}ms linear forwards`,
              animationPlayState: isRemoving ? 'paused' : 'running'
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-progress {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

// Notification Manager Hook
export const useAppleNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id, visible: true };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const success = (message, title = 'Success', options = {}) => {
    return addNotification({ 
      type: 'success', 
      title, 
      message, 
      ...options 
    });
  };

  const error = (message, title = 'Error', options = {}) => {
    return addNotification({ 
      type: 'error', 
      title, 
      message, 
      autoClose: false,
      ...options 
    });
  };

  const warning = (message, title = 'Warning', options = {}) => {
    return addNotification({ 
      type: 'warning', 
      title, 
      message, 
      ...options 
    });
  };

  const info = (message, title = 'Info', options = {}) => {
    return addNotification({ 
      type: 'info', 
      title, 
      message, 
      ...options 
    });
  };

  const NotificationContainer = () => (
    <>
      {notifications.map(notification => (
        <AppleNotification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    success,
    error,
    warning,
    info,
    removeNotification,
    NotificationContainer
  };
};

export default AppleNotification;