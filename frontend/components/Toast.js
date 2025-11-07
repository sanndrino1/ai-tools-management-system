'use client';

import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Toast = ({ 
  show = true, 
  type = 'info', 
  title, 
  message, 
  onClose,
  autoClose = true,
  duration = 5000 
}) => {
  // Auto close functionality
  if (autoClose && show) {
    setTimeout(() => {
      if (onClose) onClose();
    }, duration);
  }

  const getToastStyles = () => {
    const baseStyles = 'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5';
    
    const typeStyles = {
      success: 'border-l-4 border-green-400',
      error: 'border-l-4 border-red-400',
      warning: 'border-l-4 border-yellow-400',
      info: 'border-l-4 border-blue-400'
    };

    return `${baseStyles} ${typeStyles[type]}`;
  };

  const getIcon = () => {
    const iconStyles = 'h-6 w-6';
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconStyles} text-green-400`} />;
      case 'error':
        return <XCircleIcon className={`${iconStyles} text-red-400`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconStyles} text-yellow-400`} />;
      case 'info':
      default:
        return <InformationCircleIcon className={`${iconStyles} text-blue-400`} />;
    }
  };

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
      <div className={getToastStyles()}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              {title && (
                <p className="text-sm font-medium text-gray-900">{title}</p>
              )}
              {message && (
                <p className={`text-sm text-gray-500 ${title ? 'mt-1' : ''}`}>
                  {message}
                </p>
              )}
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

// Toast Container for managing multiple toasts
const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            show={toast.show}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => onRemove(toast.id)}
            autoClose={toast.autoClose}
            duration={toast.duration}
          />
        ))}
      </div>
    </div>
  );
};

export { Toast, ToastContainer };
export default Toast;