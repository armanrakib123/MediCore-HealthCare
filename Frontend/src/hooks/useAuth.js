import { useState, useCallback, useEffect } from 'react'

export default function useAuth() {
  // initialize from localStorage if present
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const initialUser = stored ? JSON.parse(stored) : null

  const [user, setUser] = useState(initialUser)

  // Sync user state with localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'adminAuth') {
        // Re-sync user state when localStorage changes
        const currentUser = getCurrentUser()
        setUser(currentUser)
      }
    }

    // Listen for storage changes from other tabs/components
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom auth changes within the same tab
    window.addEventListener('authStateChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChange', handleStorageChange)
    }
  }, [])

  const login = useCallback((u, token) => {
    console.log('useAuth login called with:', { user: u, token })
    setUser(u)
    try {
      if (token) localStorage.setItem('token', token)
      if (u) {
        console.log('Setting user in localStorage:', u)
        localStorage.setItem('user', JSON.stringify(u))
      }
      
      // Dispatch custom event to notify other components of auth change
      window.dispatchEvent(new CustomEvent('authStateChange', { 
        detail: { type: 'login', user: u, token } 
      }))
      
      // Force immediate re-render of components using this hook
      setTimeout(() => {
        const currentUser = getCurrentUser()
        console.log('Current user after login:', currentUser)
        setUser(currentUser)
      }, 0)
    } catch (e) { 
      console.error('Error in login:', e)
      /* ignore */ 
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('adminAuth')
      
      // Dispatch custom event to notify other components of auth change
      window.dispatchEvent(new CustomEvent('authStateChange', { 
        detail: { type: 'logout' } 
      }))
    } catch (e) { /* ignore */ }
  }, [])

  // Enhanced authentication check that includes both user and admin auth
  const isAuthenticated = useCallback(() => {
    try {
      // Check regular user authentication
      const userAuth = localStorage.getItem('user');
      if (userAuth) {
        const parsed = JSON.parse(userAuth);
        // Check if we have valid user data (username and role are required)
        if (parsed && parsed.username && parsed.role) {
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
  }, []);

  // Get current authenticated user (either regular user or admin)
  const getCurrentUser = useCallback(() => {
    try {
      // Try to get regular user first
      const userAuth = localStorage.getItem('user');
      if (userAuth) {
        const parsed = JSON.parse(userAuth);
        console.log('Found user auth in localStorage:', parsed)
        // Check if we have valid user data (username and role are the required fields)
        if (parsed && parsed.username && parsed.role) {
          console.log('Valid user found:', { ...parsed, type: 'user' })
          return { ...parsed, type: 'user' };
        }
      }

      // Try to get admin user
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth) {
        const parsed = JSON.parse(adminAuth);
        console.log('Found admin auth in localStorage:', parsed)
        if (parsed.isAuthenticated && parsed.loginTime) {
          // Check if session is still valid
          const loginTime = new Date(parsed.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursDiff <= 24) {
            const adminUser = { 
              ...parsed, 
              type: 'admin',
              username: parsed.username || parsed.name || 'Admin User'
            };
            console.log('Valid admin found:', adminUser)
            return adminUser;
          }
        }
      }

      console.log('No valid user found in localStorage')
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }, []);

  return { user, login, logout, isAuthenticated, getCurrentUser }
}
