'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Component
const Toast = ({ toast, onClose }) => {
  const { type, title, message } = toast;
  
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconStyles = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`mb-4 p-4 border rounded-md shadow-md ${typeStyles[type] || typeStyles.info}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 font-bold">{iconStyles[type] || iconStyles.info}</span>
          <div>
            {title && <h4 className="font-semibold">{title}</h4>}
            {message && <p className="text-sm">{message}</p>}
          </div>
        </div>
        <button 
          onClick={() => onClose(toast.id)}
          className="ml-4 text-xl leading-none cursor-pointer hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast Container Component  
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 min-w-80 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      show: true,
      autoClose: true,
      duration: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.autoClose) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const showSuccess = useCallback((title, message, options = {}) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options
    });
  }, [addToast]);

  const showError = useCallback((title, message, options = {}) => {
    return addToast({
      type: 'error',
      title,
      message,
      autoClose: false, // Error toasts should persist
      ...options
    });
  }, [addToast]);

  const showWarning = useCallback((title, message, options = {}) => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...options
    });
  }, [addToast]);

  const showInfo = useCallback((title, message, options = {}) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options
    });
  }, [addToast]);

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export default ToastProvider;