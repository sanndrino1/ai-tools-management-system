'use client';

import { useState, useEffect } from 'react';

// 🃏 AI-Generated Card Components
export const AICard = ({ children, className = '', elevated = false, hover = true }) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 transition-all duration-200';
  const elevatedClasses = elevated ? 'shadow-lg' : 'shadow-md';
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-300' : '';
  
  return (
    <div className={`${baseClasses} ${elevatedClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export const AIToolCard = ({ tool, onEdit, onDelete, userRole }) => {
  const canEdit = ['owner', 'pm', 'backend'].includes(userRole);
  const canDelete = ['owner'].includes(userRole);

  return (
    <AICard className="p-6" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{tool.icon || '🛠️'}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
              <p className="text-sm text-gray-500">{tool.category}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
          
          <div className="flex items-center space-x-4 mb-4">
            <AIBadge variant={tool.is_active ? 'success' : 'warning'}>
              {tool.is_active ? 'Active' : 'Inactive'}
            </AIBadge>
            <span className="text-xs text-gray-500">
              Updated {new Date(tool.updated_at).toLocaleDateString()}
            </span>
          </div>

          {tool.features && tool.features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
              <div className="flex flex-wrap gap-2">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <AIBadge key={index} variant="info" size="sm">
                    {feature}
                  </AIBadge>
                ))}
                {tool.features.length > 3 && (
                  <AIBadge variant="secondary" size="sm">
                    +{tool.features.length - 3} more
                  </AIBadge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && (
          <div className="flex flex-col space-y-2 ml-4">
            {canEdit && (
              <AIButton variant="secondary" size="sm" onClick={() => onEdit(tool)}>
                ✏️
              </AIButton>
            )}
            {canDelete && (
              <AIButton variant="danger" size="sm" onClick={() => onDelete(tool)}>
                🗑️
              </AIButton>
            )}
          </div>
        )}
      </div>

      {/* Usage Stats */}
      {tool.usage_stats && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{tool.usage_stats.views || 0}</p>
              <p className="text-xs text-gray-500">Views</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{tool.usage_stats.downloads || 0}</p>
              <p className="text-xs text-gray-500">Downloads</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{tool.usage_stats.rating || 'N/A'}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
          </div>
        </div>
      )}
    </AICard>
  );
};

// 🎯 AI-Generated Button Components
export const AIButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading && <span className="mr-2 animate-spin">⏳</span>}
      {children}
    </button>
  );
};

// 🏷️ AI-Generated Badge Components
export const AIBadge = ({ children, variant = 'secondary', size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-50 text-blue-700',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// 📝 AI-Generated Form Components
export const AIInput = ({ 
  label, 
  error, 
  helper, 
  icon, 
  className = '',
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-2 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export const AITextarea = ({ 
  label, 
  error, 
  helper, 
  className = '',
  required = false,
  rows = 4,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        rows={rows}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200 resize-none
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-2 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export const AISelect = ({ 
  label, 
  error, 
  helper, 
  options = [], 
  className = '',
  required = false,
  placeholder = 'Select an option',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-2 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

// 🔔 AI-Generated Toast Notification Component
export const AIToast = ({ message, type = 'info', isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const types = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
    },
  };

  const config = types[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`
        max-w-sm p-4 rounded-lg border shadow-lg
        ${config.bgColor} ${config.borderColor}
      `}>
        <div className="flex items-start">
          <span className={`${config.iconColor} mr-3 text-lg`}>
            {config.icon}
          </span>
          <div className="flex-1">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`ml-3 ${config.textColor} hover:opacity-75`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// 🗂️ AI-Generated Modal Component
export const AIModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`
          relative bg-white rounded-xl shadow-xl w-full ${sizes[size]}
          transform transition-all
        `}>
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// 📊 AI-Generated Loading Component
export const AILoading = ({ size = 'md', message = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

// 📋 AI-Generated Empty State Component
export const AIEmptyState = ({ icon = '📭', title, description, action }) => {
  return (
    <div className="text-center py-12">
      <span className="text-6xl mb-4 block">{icon}</span>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && action}
    </div>
  );
};