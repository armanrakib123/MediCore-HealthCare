import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaHome, FaInfoCircle, FaHospital, FaUserMd, FaPills, FaEnvelope, FaSignInAlt, FaSignOutAlt, FaUser, FaChevronDown, FaBriefcase, FaClipboard, FaBell } from 'react-icons/fa'
import Avatar from './Avatar'
import './Header.css'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Prescription ready',
    message: 'Your pharmacy prepared the latest prescription order.',
    time: '2m ago',
    type: 'pharmacy',
    link: '/pharmacy-dashboard',
    read: false
  },
  {
    id: 'n2',
    title: 'Appointment confirmed',
    message: 'Dr. Miller confirmed tomorrow\'s virtual consultation.',
    time: '1h ago',
    type: 'doctor',
    link: '/doctor-dashboard',
    read: false
  },
  {
    id: 'n3',
    title: 'New health tips',
    message: 'Review personalized insights to stay on track this week.',
    time: '4h ago',
    type: 'message',
    link: '/patient-dashboard',
    read: true
  }
]

const loadNotifications = () => {
  try {
    const stored = localStorage.getItem('notifications')
    return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS
  } catch (error) {
    console.error('Failed to read notifications', error)
    return INITIAL_NOTIFICATIONS
  }
}

const getCurrentUser = () => {
  try {
    // Check regular user authentication
    const userAuth = localStorage.getItem('user');
    if (userAuth) {
      const parsed = JSON.parse(userAuth);
      // Check if we have valid user data (username and role are required)
      if (parsed && parsed.username && parsed.role) {
        return { ...parsed, type: 'user' };
      }
    }

    // Check admin authentication
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
            username: parsed.username || parsed.name || 'Admin User'
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export default function Header() {
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showFacilitiesDropdown, setShowFacilitiesDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(loadNotifications)
  const userMenuRef = useRef(null)
  const facilitiesDropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  const navigate = useNavigate()

  // Sync user state with localStorage on mount
  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log('Header: Initial user load:', currentUser)
    setUser(currentUser)
  }, [])

  // Listen for authentication state changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('Header: Storage change detected:', e.key)
      if (e.key === 'token' || e.key === 'user' || e.key === 'adminAuth') {
        const currentUser = getCurrentUser()
        console.log('Header: User state updated:', currentUser)
        setUser(currentUser)
      }
      if (e.key === 'notifications') {
        setNotifications(loadNotifications())
      }
    }

    const handleAuthStateChange = (e) => {
      console.log('Header: Auth state change event:', e.detail)
      const currentUser = getCurrentUser()
      console.log('Header: User state updated from event:', currentUser)
      setUser(currentUser)
    }

    // Listen for storage changes from other tabs/components
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom auth changes within the same tab
    window.addEventListener('authStateChange', handleAuthStateChange)
    window.addEventListener('userLogin', handleAuthStateChange)
    window.addEventListener('userLogout', handleAuthStateChange)
    window.addEventListener('notificationsUpdate', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChange', handleAuthStateChange)
      window.removeEventListener('userLogin', handleAuthStateChange)
      window.removeEventListener('userLogout', handleAuthStateChange)
      window.removeEventListener('notificationsUpdate', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (facilitiesDropdownRef.current && !facilitiesDropdownRef.current.contains(event.target)) {
        setShowFacilitiesDropdown(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('Failed to persist notifications', error)
    }
  }, [notifications])

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminAuth')
    
    // Update local state
    setUser(null)
    setShowUserMenu(false)
    setShowNotifications(false)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authStateChange', { 
      detail: { type: 'logout' } 
    }))
    
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/login'

    const role = (user.role || '').toLowerCase();
    switch (role) {
      case 'doctor':
        return '/doctor-dashboard';
      case 'pharmacist':
        return '/pharmacy-dashboard';
      case 'admin':
      case 'super_admin':
      case 'doctor_admin':
        return '/admin-dashboard';
      case 'patient':
      default:
        return '/patient-dashboard';
    }
  }

  const getRoleIcon = () => {
    const role = (user?.role || '').toLowerCase();
    switch (role) {
      case 'pharmacist':
        return <FaPills className="role-icon" />
      case 'doctor':
        return <FaUserMd className="role-icon" />
      case 'admin':
        return <FaBriefcase className="role-icon" />
      default:
        return <FaUser className="role-icon" />
    }
  }

  const getRoleColor = () => {
    switch (user?.role) {
      case 'Pharmacist':
        return 'pharmacy'
      case 'Doctor':
        return 'doctor'
      case 'Admin':
        return 'admin'
      default:
        return 'patient'
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowUserMenu(false)
  }

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item
      )
    )
    setShowNotifications(false)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'pharmacy':
        return <FaPills className="notification-icon" />
      case 'doctor':
        return <FaUserMd className="notification-icon" />
      case 'message':
        return <FaEnvelope className="notification-icon" />
      default:
        return <FaClipboard className="notification-icon" />
    }
  }

  return (
    <header className="site-header">
      <div className="brand">
        <NavLink to="/">MediCore</NavLink>
      </div>

      <nav className="main-nav">
        <NavLink to="/"><FaHome className="nav-icon" /> Home</NavLink>
        <NavLink to="/about"><FaInfoCircle className="nav-icon" /> About</NavLink>

        <div className="dropdown" ref={facilitiesDropdownRef}>
          <button
            className="dropbtn"
            onClick={() => setShowFacilitiesDropdown(!showFacilitiesDropdown)}
            type="button"
          >
            <FaHospital className="nav-icon" /> Facilities
            <FaChevronDown className={`chevron-icon ${showFacilitiesDropdown ? 'active' : ''}`} />
          </button>
          {showFacilitiesDropdown && (
            <div className="dropdown-content show">
              <NavLink
                to="/doctors"
                onClick={() => setShowFacilitiesDropdown(false)}
              >
                <FaUserMd className="nav-icon" /> Doctors
              </NavLink>
              <NavLink
                to="/pharmacy"
                onClick={() => setShowFacilitiesDropdown(false)}
              >
                <FaPills className="nav-icon" /> Pharmacy
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/contact"><FaEnvelope className="nav-icon" /> Contact</NavLink>

        {user && (
          <div className="notifications-container" ref={notificationsRef}>
            <button
              className={`notification-btn ${showNotifications ? 'active' : ''}`}
              onClick={toggleNotifications}
              type="button"
            >
              <FaBell className="nav-icon" />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      className="notification-mark-read"
                      onClick={handleMarkAllNotificationsRead}
                      type="button"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        className={`notification-item ${notification.read ? 'read' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                        type="button"
                      >
                        <div className="notification-icon-wrapper">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <p className="notification-title">{notification.title}</p>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="notification-empty">You are all caught up</div>
                )}
              </div>
            )}
          </div>
        )}

        {user ? (
          <div className="user-menu-container" ref={userMenuRef}>
            <button
              className="user-menu-btn"
              onClick={() => {
                setShowUserMenu(!showUserMenu)
                setShowNotifications(false)
              }}
              type="button"
            >
              <Avatar user={user} size="small" />
              <span className="user-menu-text">
                <span className="username-display">{user.username}</span>
                <span className={`role-badge-header ${getRoleColor()}`}>
                  {getRoleIcon()}
                  {user.role}
                </span>
              </span>
              <FaChevronDown className={`menu-chevron ${showUserMenu ? 'active' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div className="user-menu-header">
                  <div className="user-menu-avatar">
                    <Avatar user={user} size="medium" />
                  </div>
                  <div className="user-menu-info">
                    <p className="user-menu-name">{user.username}</p>
                    <p className={`user-menu-role ${getRoleColor()}`}>
                      {getRoleIcon()}
                      {user.role}
                    </p>
                    {user.email && <p className="user-menu-email">{user.email}</p>}
                  </div>
                </div>

                <div className="user-menu-divider"></div>

                <NavLink
                  to={getDashboardLink()}
                  className="user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaClipboard className="menu-icon" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/"
                  className="user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaUser className="menu-icon" />
                  <span>Profile</span>
                </NavLink>

                <div className="user-menu-divider"></div>

                <button
                  className="user-menu-item logout-item"
                  onClick={handleLogout}
                  type="button"
                >
                  <FaSignOutAlt className="menu-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/auth" className="login-btn">
            <FaSignInAlt className="nav-icon" /> Login / Register
          </NavLink>
        )}
      </nav>
    </header>
  )
}
