import React, { createContext, useState, useContext } from 'react';
import ErrorOverlay from '../components/ui/ErrorOverlay';

// Create context
const ErrorContext = createContext({
  showError: () => {},
  hideError: () => {},
  error: null,
});

/**
 * Provider component for error handling
 */
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  // Show error with message and options
  const showError = (message, options = {}) => {
    setError({
      message,
      ...options,
    });
  };
  
  // Hide error
  const hideError = () => {
    setError(null);
  };
  
  // Retry callback
  const handleRetry = () => {
    if (error?.onRetry) {
      error.onRetry();
    }
    hideError();
  };
  
  return (
    <ErrorContext.Provider
      value={{
        showError,
        hideError,
        error,
      }}
    >
      {children}
      
      {/* Error overlay */}
      <ErrorOverlay
        visible={error !== null}
        message={error?.message || 'Something went wrong'}
        onRetry={error?.onRetry ? handleRetry : null}
        onDismiss={hideError}
      />
    </ErrorContext.Provider>
  );
};

// Custom hook for using the error context
export const useError = () => useContext(ErrorContext);

export default ErrorContext; 