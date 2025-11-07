'use client';

import React, { Fragment } from 'react';
import { 
  ExclamationTriangleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Generic error message component
const ErrorMessage = ({ 
  type = 'error', 
  title, 
  message, 
  className = '',
  showIcon = true 
}) => {
  const getStyles = () => {
    const baseStyles = 'rounded-md p-4';
    
    switch (type) {
      case 'error':
        return `${baseStyles} bg-red-50 border border-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border border-yellow-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 border border-blue-200`;
      default:
        return `${baseStyles} bg-red-50 border border-red-200`;
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    const iconStyles = 'h-5 w-5';
    
    switch (type) {
      case 'error':
        return <XCircleIcon className={`${iconStyles} text-red-400`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconStyles} text-yellow-400`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconStyles} text-blue-400`} />;
      default:
        return <XCircleIcon className={`${iconStyles} text-red-400`} />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-red-800';
    }
  };

  return (
    <div className={`${getStyles()} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
        )}
        <div className={showIcon ? 'ml-3' : ''}>
          {title && (
            <h3 className={`text-sm font-medium ${getTextColor()}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`text-sm ${getTextColor()} ${title ? 'mt-2' : ''}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorFallback 
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Error fallback UI
const ErrorFallback = ({ 
  error, 
  resetError, 
  title = 'Something went wrong',
  showDetails = false 
}) => {
  return (
    <div className="min-h-96 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          We apologize for the inconvenience. Please try refreshing the page.
        </p>
        {showDetails && error && (
          <div className="text-left bg-gray-50 p-3 rounded-md mb-4">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {error.toString()}
            </pre>
          </div>
        )}
        {resetError && (
          <button
            onClick={resetError}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

// 404 Not Found component
const NotFound = ({ 
  title = 'Page not found',
  message = "Sorry, we couldn't find the page you're looking for.",
  showHomeButton = true,
  homeLink = '/'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-200">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-8 max-w-sm mx-auto">{message}</p>
        {showHomeButton && (
          <a
            href={homeLink}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back home
          </a>
        )}
      </div>
    </div>
  );
};

// Network error component
const NetworkError = ({ onRetry, message = 'Network connection failed' }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
        </div>
        {onRetry && (
          <div className="ml-3">
            <button
              onClick={onRetry}
              className="bg-red-50 text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50 text-sm rounded-md p-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Validation error component for forms
const ValidationError = ({ errors = [], className = '' }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Please fix the following errors:
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  ErrorMessage,
  ErrorBoundary,
  ErrorFallback,
  NotFound,
  NetworkError,
  ValidationError
};

export default ErrorMessage;