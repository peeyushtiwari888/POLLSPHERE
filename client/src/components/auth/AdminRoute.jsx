import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ErrorBoundary from '../ErrorBoundary';

/**
 * A wrapper for routes that require an Admin role.
 * Must be used in conjunction with ProtectedRoute (or it should handle basic auth itself).
 * For simplicity, we just check if the user has the 'admin' role.
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, let ProtectedRoute or this redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to dashboard or show an error
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children or nested routes
  return children ? <ErrorBoundary>{children}</ErrorBoundary> : <Outlet />;
};

export default AdminRoute;
