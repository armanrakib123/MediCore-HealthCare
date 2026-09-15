import { useState, useCallback } from 'react';

// Check if user is authenticated (both regular user and admin)
const isUserAuthenticated = () => {
  try {
    // Check regular user authentication
    const userAuth = localStorage.getItem('user');
    if (userAuth) {
      const parsed = JSON.parse(userAuth);
      if (parsed && (parsed.id || parsed.userId)) {
        return true;
      }
    }

    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      const parsed = JSON.parse(adminAuth);
      
      // Check if authentication is valid
      if (parsed.isAuthenticated && parsed.loginTime) {
        // Check if session is still valid (24 hours)
        const loginTime = new Date(parsed.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff <= 24) {
          return true;
        } else {
          localStorage.removeItem('adminAuth');
          return false;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export default function useRequireAuth() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState('');

  const requireAuth = useCallback((action = "perform this action") => {
    if (isUserAuthenticated()) {
      return true; // User is authenticated, allow the action
    } else {
      // User is not authenticated, show modal
      setPendingAction(action);
      setShowLoginModal(true);
      return false; // Block the action
    }
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setPendingAction('');
  }, []);

  const getCurrentUser = useCallback(() => {
    try {
      // Try to get regular user first
      const userAuth = localStorage.getItem('user');
      if (userAuth) {
        const parsed = JSON.parse(userAuth);
        if (parsed && (parsed.id || parsed.userId)) {
          return { ...parsed, type: 'user' };
        }
      }

      // Try to get admin user
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth) {
        const parsed = JSON.parse(adminAuth);
        if (parsed.isAuthenticated && parsed.loginTime) {
          // Check if session is still valid
          const loginTime = new Date(parsed.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursDiff <= 24) {
            return { 
              ...parsed, 
              type: 'admin',
              name: parsed.username || parsed.name || 'Admin User'
            };
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return isUserAuthenticated();
  }, []);

  const getAuthRedirectUrl = useCallback(() => {
    const currentUrl = window.location.pathname + window.location.search;
    const isAdminRoute = window.location.pathname.startsWith('/admin') || 
                        window.location.pathname.startsWith('/doctor') ||
                        window.location.pathname === '/admin-dashboard';
    
    return isAdminRoute ? '/admin-login' : '/login';
  }, []);

  return {
    requireAuth,
    showLoginModal,
    closeLoginModal,
    pendingAction,
    getCurrentUser,
    isAuthenticated,
    getAuthRedirectUrl
  };
}