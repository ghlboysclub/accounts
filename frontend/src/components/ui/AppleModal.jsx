// frontend/src/components/ui/AppleModal.jsx
import React, { useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const AppleModal = ({ 
  isOpen = false, 
  onClose, 
  title, 
  children,
  size = 'medium',
  type = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Auto focus modal when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  const typeConfig = {
    default: {
      icon: null,
      color: 'blue',
      bgColor: 'bg-blue-50'
    },
    success: {
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-50'
    },
    warning: {
      icon: AlertTriangle,
      color: 'amber',
      bgColor: 'bg-amber-50'
    },
    error: {
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-50'
    },
    info: {
      icon: Info,
      color: 'blue',
      bgColor: 'bg-blue-50'
    }
  };

  const config = typeConfig[type] || typeConfig.default;
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 
          w-full ${sizes[size]} transform transition-all duration-300 ease-out
          animate-scaleIn overflow-hidden outline-none ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between p-6 border-b border-gray-200/50
          ${config.bgColor}/30 backdrop-blur-sm
        `}>
          <div className="flex items-center space-x-3">
            {IconComponent && (
              <div className={`p-2 rounded-2xl bg-${config.color}-100`}>
                <IconComponent className={`w-5 h-5 text-${config.color}-600`} />
              </div>
            )}
            <h2 
              id="modal-title"
              className="text-xl font-bold text-gray-900"
            >
              {title}
            </h2>
          </div>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-2xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Confirmation Modal Component
export const AppleConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false
}) => {
  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="small"
    >
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">{message}</p>
        
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-6 py-3 rounded-2xl font-semibold transition-all duration-200 
              flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed
              ${type === 'error' ? 
                'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25' :
                'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </AppleModal>
  );
};

export default AppleModal;