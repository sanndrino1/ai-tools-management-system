'use client';

import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';

// Toast notification context and hook
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type: options.type || 'info',
      title: options.title,
      duration: options.duration || 4000,
      actions: options.actions,
      position: options.position || 'top-right'
    };

    setToasts(prev => [...prev, toast]);

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, options) => showToast(message, { ...options, type: 'success' });
  const error = (message, options) => showToast(message, { ...options, type: 'error' });
  const warning = (message, options) => showToast(message, { ...options, type: 'warning' });
  const info = (message, options) => showToast(message, { ...options, type: 'info' });

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}

// Enhanced Toast Component
export function EnhancedToast({ toast, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onClose(toast.id), 150);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.id, onClose]);

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-white border-l-4 border-green-400 shadow-lg',
          icon: (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )
        };
      case 'error':
        return {
          bg: 'bg-white border-l-4 border-red-400 shadow-lg',
          icon: (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )
        };
      case 'warning':
        return {
          bg: 'bg-white border-l-4 border-yellow-400 shadow-lg',
          icon: (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )
        };
      case 'info':
        return {
          bg: 'bg-white border-l-4 border-blue-400 shadow-lg',
          icon: (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          )
        };
      default:
        return {
          bg: 'bg-white border-l-4 border-gray-400 shadow-lg',
          icon: null
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`max-w-sm w-full ${typeStyles.bg} rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {typeStyles.icon}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              {toast.title && (
                <p className="text-sm font-medium text-gray-900">
                  {toast.title}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {toast.message}
              </p>
              {toast.actions && (
                <div className="mt-3 flex space-x-7">
                  {toast.actions.map((action, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={action.onClick}
                      className="bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setShow(false);
                  setTimeout(() => onClose(toast.id), 150);
                }}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

// Toast Container Component
export function ToastContainer({ toasts, onRemove, position = 'top-right' }) {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-right':
        return 'top-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'top-center':
        return 'top-0 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-0 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-0 right-0';
    }
  };

  return (
    <div className={`fixed ${getPositionStyles()} z-50 p-6 space-y-4`}>
      {toasts.map((toast) => (
        <EnhancedToast
          key={toast.id}
          toast={toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
}