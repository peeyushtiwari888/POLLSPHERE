import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Protected Route Wrapper Component
 * 
 * This component acts as a gatekeeper for private pages (like the Dashboard).
 * It waits for the global AuthContext to finish its initial token verification.
 * If verified, it renders the page. If not, it redirects the user to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Gets the current URL the user is trying to access

  // Step 1: Wait for authentication check to complete
  // The AuthContext sets isLoading to true while it validates the token on mount.
  if (isLoading) {
    return (
      // A clean, centered loading spinner using the primary orange brand color
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Step 2: Redirect unauthenticated users
  if (!isAuthenticated) {
    // We use the `state` prop to pass the 'location' they were trying to access.
    // This allows the Login page to redirect them back here after a successful login
    // instead of always dumping them onto the default dashboard page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Step 3: Render the protected component
  // If the code reaches here, the user is fully authenticated.
  return children;
};

export default ProtectedRoute;
