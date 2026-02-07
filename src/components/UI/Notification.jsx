import React, { useEffect } from 'react';

/**
 * Notification component for displaying toast messages
 * @param {Object} props - Notification properties
 * @param {string} props.message - Notification message
 * @param {string} props.type - Notification type (success, error, info, warning)
 * @param {boolean} props.show - Show/hide state
 * @param {function} props.onClose - Close handler
 * @param {number} props.duration - Auto-close duration in ms (0 = no auto-close)
 */
const Notification = ({ 
  message, 
  type = 'info', 
  show = false, 
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  
  if (!show) return null;
  
  const typeClasses = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
  };
  
  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border-l-4 shadow-lg ${typeClasses[type]}`}>
        <span className="text-2xl">{iconMap[type]}</span>
        <p className="font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-xl hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;
