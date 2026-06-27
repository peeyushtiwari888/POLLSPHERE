import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to consume the AuthContext
 * 
 * This hook provides a clean and easy way to access the global authentication 
 * state (user, isAuthenticated, isLoading) and functions (login, logout) from 
 * anywhere inside your components.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Safety check: If context is undefined, it means this hook is being called 
  // inside a component that is NOT wrapped by the <AuthProvider> in main.jsx/App.jsx.
  // Throwing a clear error here saves hours of debugging later.
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
