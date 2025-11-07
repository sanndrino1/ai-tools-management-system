'use client';

import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Enhanced Card Component
export function EnhancedCard({ children, className = '', hover = true, shadow = 'md', padding = 'p-6' }) {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-300' : '';
  const shadowClass = {
    'sm': 'shadow-sm',
    'md': 'shadow-md', 
    'lg': 'shadow-lg',
    'xl': 'shadow-xl'
  }[shadow];

  return (
    <div className={`bg-white ${shadowClass} ${hoverClass} rounded-lg border border-gray-200 ${padding} ${className}`}>
      {children}
    </div>
  );
}

// AI Tool Card Component
export function ToolCard({ tool, onEdit, onDelete, onView }) {
  return (
    <EnhancedCard hover={true} className="relative group">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{tool.icon}</div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(tool)}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
              title="Edit tool"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(tool)}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Delete tool"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {tool.category}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{tool.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">by {tool.creator}</span>
        <div className="flex space-x-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Visit
          </a>
          {onView && (
            <button
              onClick={() => onView(tool)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
            >
              Details
            </button>
          )}
        </div>
      </div>
    </EnhancedCard>
  );
}

// Enhanced Dropdown Component
export function Dropdown({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select option...",
  className = "",
  disabled = false 
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          appearance-none w-full px-3 py-2 pr-10 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          bg-white text-gray-900 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}

// Enhanced Modal Component
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    'sm': 'max-w-md',
    'md': 'max-w-lg', 
    'lg': 'max-w-2xl',
    'xl': 'max-w-4xl'
  }[size];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className={`
          inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl 
          transform transition-all sm:my-8 sm:align-middle ${sizeClasses} sm:w-full
        `}>
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className="bg-white px-4 pt-5 pb-4 sm:px-6 sm:pb-4">
              <div className="flex items-center justify-between">
                {title && (
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Button Component
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  onClick,
  className = "",
  type = "button"
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500", 
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

// Enhanced Input Component
export function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  label,
  required = false,
  className = ""
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Stats Card Component
export function StatsCard({ title, value, icon, color = 'blue', trend }) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <EnhancedCard className="relative overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`flex items-center justify-center h-8 w-8 rounded-md ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-lg font-medium text-gray-900">
              {value}
            </dd>
          </dl>
        </div>
      </div>
      {trend && (
        <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-2 text-sm">
          <div className="text-gray-600">
            {trend}
          </div>
        </div>
      )}
    </EnhancedCard>
  );
}