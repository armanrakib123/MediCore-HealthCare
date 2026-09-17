import api from '../api/api';
import React, { useState, memo, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Activity, Users, Pill, Calendar, Bell, Settings, LogOut, 
  UserCircle, Menu, X, Home, Package, DollarSign, TrendingUp, 
  BarChart3, Shield, AlertCircle, CheckCircle, Download, Filter,
  Search, Plus, Eye, Edit, Trash2, Server, Database, Zap, Clock
} from 'lucide-react';

// --- Constants & Mock Data ---

const ADMIN_INFO = {
  name: 'Admin Dashboard',
  email: 'admin@MediCore.com',
  id: 'ADM-001',
  role: 'System Administrator',
  avatar: 'AD'
};

// Admin Context for live MongoDB Atlas backend data
export const AdminContext = React.createContext({
  stats: {
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalPharmacies: 0,
    prescriptionsMonth: 0,
    monthlyRevenue: 0,
    systemUptime: 99.98,
    activeUsers: 0,
    newRegistrations: 0,
    avgProcessingTime: 2.1,
    fulfillmentRate: 97.4,
    userGrowth: 15,
    revenueGrowth: 18
  },
  users: [],
  pharmacies: [],
  systemHealth: [],
  loading: false,
  refresh: () => {}
});

export const useAdmin = () => React.useContext(AdminContext);

// Enhanced navigation with better structure
const NAVIGATION_ITEMS = [
  { icon: Home, label: 'Dashboard', value: 'dashboard' },
  { icon: BarChart3, label: 'System Analytics', value: 'analytics' },
  { icon: Users, label: 'User Management', value: 'users' },
  { icon: Activity, label: 'Doctor Management', value: 'doctors' },
  { icon: Package, label: 'Pharmacy Network', value: 'pharmacies' },
  { icon: DollarSign, label: 'Financial Reports', value: 'finance' },
  { icon: Shield, label: 'Compliance & Audit', value: 'compliance' },
  { icon: Server, label: 'System Health', value: 'system' },
  { icon: Settings, label: 'System Settings', value: 'settings' }
];

// Valid tab validation
const VALID_TABS = new Set(NAVIGATION_ITEMS.map(item => item.value));

// --- Error Boundary Component ---
class TabErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Tab navigation error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Navigation Error</h3>
            <p className="text-gray-600 mb-4">An error occurred while loading this section.</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Enhanced Header Component ---
const Header = memo(({ sidebarOpen, setSidebarOpen }) => {
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={handleSidebarToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Toggle sidebar"
          type="button"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">MediCore</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search system..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
            aria-label="Search system"
            role="search"
          />
        </div>

        <button 
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500" 
          aria-label="Notifications"
          type="button"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
        </button>

        <button 
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500" 
          aria-label="User menu" 
          type="button"
        >
          <UserCircle className="w-8 h-8 text-gray-600" />
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-800">{ADMIN_INFO.name}</p>
            <p className="text-xs text-gray-600">{ADMIN_INFO.email}</p>
          </div>
        </button>

        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500" 
          aria-label="Settings" 
          type="button"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
});

// --- Enhanced Sidebar Component ---
const Sidebar = memo(({ 
  sidebarOpen, 
  setSidebarOpen, 
  selectedTab, 
  setSelectedTab,
  onTabChange 
}) => {
  // Validate tab changes with error handling
  const handleTabChange = useCallback((newTab) => {
    try {
      if (!VALID_TABS.has(newTab)) {
        console.warn(`Invalid tab: ${newTab}. Falling back to dashboard.`);
        newTab = 'dashboard';
      }
      setSelectedTab(newTab);
      onTabChange?.(newTab);
    } catch (error) {
      console.error('Error changing tab:', error);
      // Fallback to safe tab
      setSelectedTab('dashboard');
    }
  }, [setSelectedTab, onTabChange]);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  // Memoize navigation items for performance
  const navigationElements = useMemo(() => 
    NAVIGATION_ITEMS.map((item) => (
      <button
        key={item.value}
        type="button"
        onClick={() => handleTabChange(item.value)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          selectedTab === item.value
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100 bg-transparent'
        }`}
        aria-current={selectedTab === item.value ? 'page' : undefined}
        aria-label={`Navigate to ${item.label}`}
      >
        <item.icon className={`w-5 h-5 ${selectedTab === item.value ? 'text-white' : 'text-gray-500'}`} />
        <span className="font-medium">{item.label}</span>
      </button>
    )), [selectedTab, handleTabChange]
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={handleSidebarClose} 
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar panel */}
      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 
          bg-white border-r border-gray-200 transition-transform duration-300 
          flex flex-col
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button 
            onClick={handleSidebarClose}
            className="p-2 hover:bg-gray-100 rounded-lg bg-transparent"
            aria-label="Close sidebar"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Admin info card */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {ADMIN_INFO.avatar}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Admin Panel</h3>
              <p className="text-xs text-gray-600">{ADMIN_INFO.role}</p>
              <p className="text-xs text-gray-500">{ADMIN_INFO.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-purple-50 rounded-lg p-2">
              <p className="text-gray-600">Total Users</p>
              <p className="font-semibold text-gray-800">{(stats.totalUsers/1000).toFixed(1)}K</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-2">
              <p className="text-gray-600">Uptime</p>
              <p className="font-semibold text-gray-800">{stats.systemUptime}%</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto" role="navigation" aria-label="Main navigation">
          <div className="space-y-2">
            {navigationElements}
          </div>
        </nav>

        {/* System status */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-gray-800">All Systems Operational</h4>
            </div>
            <p className="text-xs text-gray-600">Uptime: {stats.systemUptime}%</p>
          </div>
        </div>
      </div>
    </>
  );
});

// --- Placeholder Components for Future Views ---
const UserManagementView = memo(() => {
  const { users } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Directory (MongoDB)</h2>
          <p className="text-gray-600">Total registered accounts: {users.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Username</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Joined</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {u.avatarEmoji || (u.name || u.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{u.name || u.username}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 font-mono text-xs text-gray-600">@{u.username}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{u.joined || 'Sep 16, 2026'}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {u.status || 'active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const AnalyticsView = memo(() => (
  <div className="p-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
    <p className="text-gray-600">Analytics dashboard coming soon...</p>
  </div>
));

const DoctorsView = memo(() => {
  const navigate = useNavigate();
  const { stats } = useAdmin();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Management</h2>
            <p className="text-gray-600">Manage doctor profiles, credentials, and information</p>
          </div>
          <button
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Activity className="w-5 h-5" />
            Manage Doctors
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Edit Doctor Profiles</span>
          </button>
          <button
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-green-600" />
            <span className="font-medium">Add New Doctor</span>
          </button>
          <button
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-5 h-5 text-purple-600" />
            <span className="font-medium">View All Doctors</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const PlaceholderView = memo(({ title }) => (
  <div className="p-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-600">{title} module coming soon...</p>
  </div>
));

// --- Main Dashboard View Component ---
const DashboardView = memo(() => {
  const { stats, users } = useAdmin();
  return (
  <div className="space-y-6">
    {/* Welcome banner */}
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">System Overview 🎯</h2>
          <p className="text-purple-100 text-lg">MediCore Management Dashboard</p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            +{stats.userGrowth}%
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalUsers.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Total Users</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6 text-blue-600" />
          </div>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">{stats.prescriptionsMonth.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Prescriptions/Month</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-cyan-600" />
          </div>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
            +2 new
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalPharmacies}</p>
        <p className="text-sm text-gray-600">Active Pharmacies</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            +{stats.revenueGrowth}%
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">${(stats.monthlyRevenue/1000).toFixed(0)}K</p>
        <p className="text-sm text-gray-600">Monthly Revenue</p>
      </div>
    </div>

    {/* System Performance */}
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">System Performance</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Processing Time</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                ↓12%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.avgProcessingTime} hrs</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fulfillment Rate</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                ↑2%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.fulfillmentRate}%</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
            <span className="text-sm text-gray-600">System Uptime</span>
            <p className="text-3xl font-bold text-gray-800">{stats.systemUptime}%</p>
            <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">User Activity (7 days)</h3>
        <div className="space-y-4">
          {/* Add chart component or activity data here */}
          <div className="text-center text-gray-500">
            Activity chart component would go here
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Users</h3>
        <div className="space-y-3">
          {users.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
});

// --- Main Enhanced Component ---
const AdminDashboard = () => {
  // Enhanced state management with error handling and persistence
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check localStorage for persisted sidebar state
    try {
      const saved = localStorage.getItem('admin-sidebar-open');
      return saved ? JSON.parse(saved) : true;
    } catch (error) {
      console.warn('Error reading sidebar state from localStorage:', error);
      return true;
    }
  });
  
  const [selectedTab, setSelectedTab] = useState(() => {
    // Check localStorage for persisted tab state
    try {
      const saved = localStorage.getItem('admin-selected-tab');
      const initialTab = saved && VALID_TABS.has(saved) ? saved : 'dashboard';
      return initialTab;
    } catch (error) {
      console.warn('Error reading tab state from localStorage:', error);
      return 'dashboard';
    }
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Persist state to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('admin-sidebar-open', JSON.stringify(sidebarOpen));
    } catch (error) {
      console.warn('Error saving sidebar state to localStorage:', error);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('admin-selected-tab', selectedTab);
    } catch (error) {
      console.warn('Error saving tab state to localStorage:', error);
    }
  }, [selectedTab]);

  // Enhanced online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    
    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
    };
  }, []);

  // Enhanced tab change handler with analytics
  const handleTabChange = useCallback((newTab) => {
    try {
      console.log(`Navigation: ${selectedTab} → ${newTab}`);
      // Could send analytics event here
      // analytics.track('navigation', { from: selectedTab, to: newTab });
    } catch (error) {
      console.error('Error tracking navigation:', error);
    }
  }, [selectedTab]);

  // Memoize tab content for performance
  const tabContent = useMemo(() => {
    const tabComponents = {
      dashboard: <DashboardView />,
      users: <UserManagementView />,
      doctors: <DoctorsView />,
      analytics: <AnalyticsView />,
      pharmacies: <PlaceholderView title="Pharmacy Network" />,
      finance: <PlaceholderView title="Financial Reports" />,
      compliance: <PlaceholderView title="Compliance & Audit" />,
      system: <PlaceholderView title="System Health" />,
      settings: <PlaceholderView title="System Settings" />
    };

    return (
      <TabErrorBoundary key={selectedTab}>
        {tabComponents[selectedTab] || <DashboardView />}
      </TabErrorBoundary>
    );
  }, [selectedTab]);

  return (
    <AdminContext.Provider value={{ stats, users, systemHealth, loading, refresh: fetchAdminData }}>
      <div className="flex h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab}
        onTabChange={handleTabChange}
      />
      
      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Connection status indicator */}
          {!isOnline && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>You're offline. Some features may be limited.</span>
              </div>
            </div>
          )}
          
          {/* Session timeout warning */}
          {Date.now() - lastActivity > 3600000 && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>You've been inactive for a while.</span>
                </div>
                <button 
                  onClick={() => setLastActivity(Date.now())}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Stay Active
                </button>
              </div>
            </div>
          )}
          
          {tabContent}
        </main>
      </div>
    </div>
    </AdminContext.Provider>
  );
};

export default AdminDashboard;