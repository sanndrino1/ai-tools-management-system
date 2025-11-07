'use client';

import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import ModernNavigation from '../../components/ModernNavigation';
import { 
  LoadingOverlay, 
  LoadingButton, 
  CardSkeleton, 
  ListSkeleton 
} from '../../components/Loading';
import { 
  ErrorMessage, 
  ValidationError, 
  NetworkError 
} from '../../components/Error';

export default function ComponentsDemo() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Demo functions
  const handleToastDemo = (type) => {
    switch(type) {
      case 'success':
        showSuccess('Operation Successful', 'Your changes have been saved successfully.');
        break;
      case 'error':
        showError('Operation Failed', 'Something went wrong. Please try again.');
        break;
      case 'warning':
        showWarning('Warning', 'Please review your data before proceeding.');
        break;
      case 'info':
        showInfo('Information', 'New features are available in the dashboard.');
        break;
    }
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccess('Complete', 'Loading demo finished successfully!');
    }, 3000);
  };

  const handleValidationDemo = () => {
    setValidationErrors([
      'Name field is required',
      'Email must be valid format',
      'Password must be at least 8 characters'
    ]);
  };

  const clearValidation = () => {
    setValidationErrors([]);
  };

  const handleNetworkErrorDemo = () => {
    setShowNetworkError(true);
  };

  const retryNetworkRequest = () => {
    setShowNetworkError(false);
    showInfo('Retrying', 'Attempting to reconnect...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <ModernNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            UI Components Demo
          </h1>
          <p className="text-gray-600">
            Demonstration of all UI components in the AI Tools Management System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Toast Notifications Demo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Toast Notifications
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleToastDemo('success')}
                className="ai-btn ai-btn-success"
              >
                Success Toast
              </button>
              <button
                onClick={() => handleToastDemo('error')}
                className="ai-btn ai-btn-danger"
              >
                Error Toast
              </button>
              <button
                onClick={() => handleToastDemo('warning')}
                className="ai-btn ai-btn-warning"
              >
                Warning Toast
              </button>
              <button
                onClick={() => handleToastDemo('info')}
                className="ai-btn ai-btn-secondary"
              >
                Info Toast
              </button>
            </div>
          </div>

          {/* Loading Components Demo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Loading Components
            </h2>
            <div className="space-y-4">
              <LoadingButton
                loading={isLoading}
                onClick={handleLoadingDemo}
                className="ai-btn ai-btn-primary w-full"
                loadingText="Processing..."
              >
                Start Loading Demo
              </LoadingButton>
              
              <LoadingOverlay isLoading={isLoading} message="Processing your request...">
                <div className="h-24 bg-gray-50 rounded-md flex items-center justify-center">
                  <p className="text-gray-600">Content with loading overlay</p>
                </div>
              </LoadingOverlay>
            </div>
          </div>

          {/* Error Components Demo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Error Components
            </h2>
            <div className="space-y-4">
              <ErrorMessage
                type="error"
                title="System Error"
                message="An unexpected error occurred in the system."
              />
              
              <ErrorMessage
                type="warning"
                title="Performance Warning"
                message="The system is experiencing high load."
              />
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={handleValidationDemo}
                    className="ai-btn ai-btn-secondary text-sm"
                  >
                    Show Validation
                  </button>
                  <button
                    onClick={clearValidation}
                    className="ai-btn ai-btn-outline text-sm"
                  >
                    Clear
                  </button>
                </div>
                <ValidationError errors={validationErrors} />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleNetworkErrorDemo}
                  className="ai-btn ai-btn-danger text-sm"
                >
                  Simulate Network Error
                </button>
                {showNetworkError && (
                  <NetworkError
                    onRetry={retryNetworkRequest}
                    message="Failed to connect to the server"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Skeleton Loading Demo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Skeleton Loading
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Card Skeleton</h3>
                <CardSkeleton />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">List Skeleton</h3>
                <ListSkeleton count={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Form Components Demo */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Form Components Demo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="ai-label">Sample Input</label>
                <input type="text" className="ai-input" placeholder="Enter some text..." />
              </div>
              
              <div>
                <label className="ai-label">Sample Select</label>
                <select className="ai-select">
                  <option>Choose an option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
              
              <div>
                <label className="ai-label">Sample Textarea</label>
                <textarea className="ai-textarea" rows="3" placeholder="Enter description..."></textarea>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Button Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="ai-btn ai-btn-primary">Primary</button>
                  <button className="ai-btn ai-btn-secondary">Secondary</button>
                  <button className="ai-btn ai-btn-success">Success</button>
                  <button className="ai-btn ai-btn-danger">Danger</button>
                  <button className="ai-btn ai-btn-warning">Warning</button>
                  <button className="ai-btn ai-btn-outline">Outline</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Card Example</h3>
                <div className="ai-card">
                  <div className="ai-card-header">
                    <h4 className="ai-card-title">Sample Card</h4>
                  </div>
                  <div className="ai-card-body">
                    <p className="text-sm text-gray-600">
                      This is a sample card component with header and body content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Panel */}
        {user && (
          <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h2>
            <p className="opacity-90">
              Role: <span className="font-medium">{user.role}</span> | 
              Status: <span className="font-medium">Active</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}