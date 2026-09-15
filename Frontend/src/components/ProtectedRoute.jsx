import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    try {
      const authData = localStorage.getItem('adminAuth');
      if (!authData) return false;
      
      const parsed = JSON.parse(authData);
      
      // Check if authentication is valid
      if (!parsed.isAuthenticated || !parsed.loginTime) return false;
      
      // Check if session is still valid (24 hours)
      const loginTime = new Date(parsed.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        localStorage.removeItem('adminAuth');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      localStorage.removeItem('adminAuth');
      return false;
    }
  };

  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    
    try {
      const authData = localStorage.getItem('adminAuth');
      if (!authData) return false;
      
      const parsed = JSON.parse(authData);
      return parsed.role === requiredRole || parsed.role === 'super_admin';
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  if (!isAuthenticated()) {
    // Redirect to admin login with return url
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole()) {
    // User is authenticated but doesn't have required role
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this area. Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}