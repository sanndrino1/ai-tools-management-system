'use client';

import { Fragment } from 'react';

// Spinner component
const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    green: 'text-green-600',
    teal: 'text-teal-600',
    cyan: 'text-cyan-600',
    gray: 'text-gray-600'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Loading overlay component
const LoadingOverlay = ({ isLoading, message = 'Loading...', children }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-gray-700">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading screen for full page loading
const LoadingScreen = ({ message = 'Loading...', subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Spinner size="xl" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{message}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

// Loading button component
const LoadingButton = ({ 
  loading, 
  children, 
  disabled, 
  className = '', 
  loadingText = 'Loading...', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseClasses} ${className}`}
    >
      {loading && (
        <Spinner size="sm" color="gray" />
      )}
      <span className={loading ? 'ml-2' : ''}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

// Skeleton loading component
const Skeleton = ({ className = '', animate = true, ...props }) => {
  const animateClass = animate ? 'animate-pulse' : '';
  return (
    <div
      className={`bg-gray-200 rounded ${animateClass} ${className}`}
      {...props}
    />
  );
};

// Card skeleton for loading cards
const CardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
};

// List skeleton for loading lists
const ListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm animate-pulse">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-6" />
        </div>
      ))}
    </div>
  );
};

// Table skeleton for loading tables
const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-24" />
            ))}
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-24" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  Spinner,
  LoadingOverlay,
  LoadingScreen,
  LoadingButton,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton
};

export default LoadingOverlay;