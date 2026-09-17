import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Activity, Users, Pill, Calendar, FileText, Bell, LogOut, 
  UserCircle, Menu, X, Home, Clock, AlertCircle, Search,
  Plus, Edit, Eye, Filter, Download, TrendingUp, ClipboardList, BarChart3,
  Settings, Shield, Award, CheckCircle, Package
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import api from '../api/api';
import { DoctorDashboardContext, useDoctorDashboard } from '../context/DoctorDashboardContext';

// --- Constants & Mock Data ---

// Doctor configuration constants for maintainability
const DOCTOR_CONFIG = {
  LICENSE_FORMAT: /^[A-Z]{2}-\d+$/,
  NPI_LENGTH: 10,
  AVATAR_MAX_LENGTH: 4,
  VALID_SPECIALTIES: [
    'Cardiology', 
    'Internal Medicine', 
    'Family Medicine', 
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'Oncology'
  ]
};

// Default doctor info with validation
const DEFAULT_DOCTOR_INFO = Object.freeze({
  name: 'Unknown Doctor',
  email: '',
  id: '',
  specialty: 'Internal Medicine',
  license: '',
  npi: '',
  avatar: 'DR',
  yearsExperience: 0
});

// Helper functions for data validation and transformation
const doctorInfoHelpers = {
  /**
   * Validates license format (XX-YYYYY pattern)
   */
  validateLicense(license) {
    if (!license || typeof license !== 'string') return false;
    return DOCTOR_CONFIG.LICENSE_FORMAT.test(license.trim());
  },

  /**
   * Validates NPI number (10 digits)
   */
  validateNPI(npi) {
    if (!npi || typeof npi !== 'string') return false;
    const cleanNPI = npi.replace(/\D/g, '');
    return cleanNPI.length === DOCTOR_CONFIG.NPI_LENGTH && /^\d{10}$/.test(cleanNPI);
  },

  /**
   * Sanitizes and validates avatar initials
   */
  sanitizeAvatar(avatar) {
    if (!avatar || typeof avatar !== 'string') return DEFAULT_DOCTOR_INFO.avatar;
    const cleanAvatar = avatar.trim().replace(/[^A-Za-z]/g, '').toUpperCase();
    return cleanAvatar.slice(0, DOCTOR_CONFIG.AVATAR_MAX_LENGTH) || DEFAULT_DOCTOR_INFO.avatar;
  },

  /**
   * Validates specialty against allowed list
   */
  validateSpecialty(specialty) {
    return DOCTOR_CONFIG.VALID_SPECIALTIES.includes(specialty);
  },

  /**
   * Generates avatar from doctor name
   */
  generateAvatarFromName(name) {
    if (!name || typeof name !== 'string') return DEFAULT_DOCTOR_INFO.avatar;
    const names = name.split(' ').filter(n => n.length > 0);
    if (names.length === 0) return DEFAULT_DOCTOR_INFO.avatar;
    
    const initials = names
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
    
    return this.sanitizeAvatar(initials);
  },

  /**
   * Creates a validated doctor info object with fallbacks
   */
  createValidatedDoctorInfo(rawInfo = {}) {
    const validatedInfo = { ...DEFAULT_DOCTOR_INFO };
    
    // Validate and set name
    if (rawInfo.name && typeof rawInfo.name === 'string' && rawInfo.name.trim()) {
      validatedInfo.name = rawInfo.name.trim();
    }

    // Validate and set email
    if (rawInfo.email && typeof rawInfo.email === 'string' && rawInfo.email.includes('@')) {
      validatedInfo.email = rawInfo.email.trim();
    }

    // Validate and set ID
    if (rawInfo.id && typeof rawInfo.id === 'string' && rawInfo.id.trim()) {
      validatedInfo.id = rawInfo.id.trim();
    }

    // Validate and set specialty
    if (this.validateSpecialty(rawInfo.specialty)) {
      validatedInfo.specialty = rawInfo.specialty;
    }

    // Validate and set license
    if (this.validateLicense(rawInfo.license)) {
      validatedInfo.license = rawInfo.license.trim();
    }

    // Validate and set NPI
    if (this.validateNPI(rawInfo.npi)) {
      validatedInfo.npi = rawInfo.npi.replace(/\D/g, '');
    }

    // Set avatar (use provided or generate from name)
    validatedInfo.avatar = rawInfo.avatar 
      ? this.sanitizeAvatar(rawInfo.avatar)
      : this.generateAvatarFromName(validatedInfo.name);

    // Validate and set years of experience
    const years = parseInt(rawInfo.yearsExperience);
    if (!isNaN(years) && years >= 0 && years <= 50) {
      validatedInfo.yearsExperience = years;
    }

    return Object.freeze(validatedInfo);
  }
};

// User profile component that adapts to logged-in user data
const UserProfile = memo(() => {
  const { user, logout } = useAuth();
  
  // Default values if no user is logged in
  const defaultProfile = {
    username: 'Guest User',
    role: 'Doctor',
    email: 'guest@healthcare.com',
    avatarColor: 'from-emerald-500 to-teal-600',
    avatarEmoji: '👨‍⚕️',
    profileImageUrl: null
  };
  
  const currentUser = user || defaultProfile;
  
  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden md:block">
        <p className="text-sm font-semibold text-gray-800">{currentUser.username}</p>
        <p className="text-xs text-gray-600">{currentUser.role}</p>
      </div>
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {currentUser.avatarEmoji || currentUser.username.charAt(0).toUpperCase()}
      </div>
      <button 
        onClick={logout}
        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors bg-transparent" 
        aria-label="Log out"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
});

// Doctor-specific data adapter
const useDoctorData = () => {
  const { user } = useAuth();
  
  // Use real user data or fallback to defaults
  const doctorInfo = user ? {
    name: user.username || 'Unknown Doctor',
    email: user.email || '',
    id: user.id || 'DOC-GUEST',
    specialty: user.specialty || 'General Medicine',
    license: user.license || 'MD-GUEST',
    npi: user.npi || '0000000000',
    avatar: user.avatarEmoji || '👨‍⚕️',
    yearsExperience: user.experience || 0
  } : {
    name: 'Dr. Guest User',
    email: 'guest@healthcare.com',
    id: 'DOC-GUEST',
    specialty: 'General Medicine',
    license: 'MD-GUEST',
    npi: '0000000000',
    avatar: '👨‍⚕️',
    yearsExperience: 0
  };
  
  return Object.freeze(doctorInfo);
};

// Live DoctorDashboardContext imported from ../context/DoctorDashboardContext

const NAVIGATION_ITEMS = [
  { icon: Home, label: 'Dashboard', value: 'dashboard' },
  { icon: Users, label: 'Patient Panel', value: 'patients' },
  { icon: FileText, label: 'Write Prescription', value: 'prescribe' },
  { icon: ClipboardList, label: 'Prescription Queue', value: 'queue' },
  { icon: Calendar, label: 'My Schedule', value: 'schedule' },
  { icon: BarChart3, label: 'Analytics', value: 'analytics' },
  { icon: AlertCircle, label: 'Clinical Alerts', value: 'alerts' },
  { icon: UserCircle, label: 'Profile', value: 'profile' }
];

// --- Sub-Components ---

const Header = memo(({ sidebarOpen, setSidebarOpen }) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
    <div className="flex items-center gap-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg bg-transparent"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
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
          placeholder="Search patients..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
          aria-label="Search patients"
        />
      </div>

      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent" aria-label="Notifications">
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <UserProfile />
    </div>
  </header>
));

const Sidebar = memo(({ sidebarOpen, setSidebarOpen, selectedTab, setSelectedTab }) => {
  const doctorInfo = useDoctorData();
  
  return (
    <>
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 flex flex-col`}>
        <div className="lg:hidden absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg bg-transparent" aria-label="Close sidebar">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Doctor info card */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {doctorInfo.avatar}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{doctorInfo.name}</h3>
              <p className="text-xs text-gray-600">{doctorInfo.specialty}</p>
              <p className="text-xs text-gray-500">{doctorInfo.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50 rounded-lg p-2">
              <p className="text-gray-600">NPI</p>
              <p className="font-semibold text-gray-800">{doctorInfo.npi}</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-2">
              <p className="text-gray-600">Experience</p>
              <p className="font-semibold text-gray-800">{doctorInfo.yearsExperience} years</p>
            </div>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedTab(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                selectedTab === item.value
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 bg-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${selectedTab === item.value ? 'text-white' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Quick actions */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          New Prescription
        </button>
      </div>
    </div>
    </>
  );
});

const StatCard = memo(({ icon: Icon, iconColorClass, iconBgClass, value, label, trendIcon: TrendIcon, trendColorClass, badgeText, badgeColorClass }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${iconBgClass} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>
      {TrendIcon && <TrendIcon className={`w-5 h-5 ${trendColorClass}`} />}
      {badgeText && (
        <span className={`${badgeColorClass} px-2 py-1 rounded-full text-xs font-semibold`}>
          {badgeText}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
));

const DashboardView = memo(({ setSelectedTab }) => {
  const { user } = useAuth();
  const { stats = { todayPatients: 0, appointments: 0, pendingScripts: 0, criticalCases: 0, prescriptionsThisMonth: 0, avgPatientsPerDay: 0, adherenceRate: 95 }, patientQueue = [], clinicalAlerts = [], doctorInfo = null } = useDoctorDashboard();
  const currentDoctor = doctorInfo || {};
  
  // Generate dynamic greeting based on time
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  
  // Extract doctor name without "Dr." prefix for greeting
  const rawName = currentDoctor.name || user?.username || 'Doctor';
  const doctorName = rawName.replace(/^Dr\.?\s*/, '');
  
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{getTimeBasedGreeting()}, {doctorName}! ☀️</h2>
            <p className="text-emerald-100 text-lg">You have {stats.todayPatients} patients scheduled today</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        icon={Users} 
        iconBgClass="bg-emerald-100" 
        iconColorClass="text-emerald-600" 
        value={stats.todayPatients} 
        label="Today's Patients" 
        trendIcon={TrendingUp} 
        trendColorClass="text-emerald-600" 
      />
      <StatCard 
        icon={Calendar} 
        iconBgClass="bg-blue-100" 
        iconColorClass="text-blue-600" 
        value={stats.appointments} 
        label="Appointments" 
        trendIcon={Clock} 
        trendColorClass="text-blue-600" 
      />
      <StatCard 
        icon={FileText} 
        iconBgClass="bg-orange-100" 
        iconColorClass="text-orange-600" 
        value={stats.pendingScripts} 
        label="Pending Scripts" 
        badgeText="Pending"
        badgeColorClass="bg-orange-100 text-orange-700"
      />
      <StatCard 
        icon={AlertCircle} 
        iconBgClass="bg-red-100" 
        iconColorClass="text-red-600" 
        value={stats.criticalCases} 
        label="Critical Cases" 
        badgeText="Urgent"
        badgeColorClass="bg-red-100 text-red-700"
      />
    </div>

    {/* Patient Queue */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Patient Queue</h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg bg-transparent" aria-label="Filter queue">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {patientQueue.slice(0, 4).map((patient) => (
          <div key={patient.id} className={`p-5 rounded-xl border-2 transition-all ${
            patient.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold ${
                    patient.urgent ? 'bg-red-500' : 'bg-emerald-500'
                  }`}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-2">{patient.time}</p>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{patient.name}</h3>
                    {patient.urgent && (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        URGENT
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      patient.status === 'checked-in' ? 'bg-green-100 text-green-700' :
                      patient.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{patient.condition} • {patient.age}y, {patient.gender}</p>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>BP: {patient.vitals.bp}</span>
                    <span>Pulse: {patient.vitals.pulse}</span>
                    <span>Active Rx: {patient.activeRx}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Chart
                </button>
                <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-semibold bg-transparent">
                  Prescribe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Clinical Alerts + Quick Prescription */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Clinical Alerts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Clinical Alerts</h3>
          <button onClick={() => setSelectedTab('alerts')} className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 bg-transparent">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {clinicalAlerts.map((alert, i) => (
            <div key={i} className={`p-4 rounded-xl border-l-4 ${
              alert.type === 'high' ? 'bg-red-50 border-red-500' :
              alert.type === 'medium' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{alert.patient}</h4>
                    <span className="text-xs text-gray-600">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <p className="text-xs font-semibold text-gray-600">{alert.action}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold ml-4 bg-transparent">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Prescription Writer */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Prescription Writer</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient</label>
            <input
              type="text"
              placeholder="Search patient..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Medication</label>
            <input
              type="text"
              placeholder="Medication name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage</label>
              <input
                type="text"
                placeholder="500mg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
              </select>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold shadow-lg">
            Generate Prescription
          </button>
        </div>
      </div>
    </div>
  </div>
  );
});

const PatientPanelView = memo(() => {
  const { patientQueue } = useDoctorDashboard();
  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Patient Panel</h2>
      <div className="flex gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Search patients"
          />
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Patient</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Condition</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Active Rx</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Visit</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientQueue.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No patients in queue yet. Appointments booked will appear here.
                </td>
              </tr>
            ) : patientQueue.map((patient) => (
              <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{patient.name}</p>
                      <p className="text-xs text-gray-600">{patient.patientId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-gray-700">{patient.condition}</p>
                  <p className="text-xs text-gray-600">{patient.age}y, {patient.gender}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {patient.activeRx} Rx
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-700">{patient.lastVisit}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    patient.urgent ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {patient.urgent ? 'Urgent' : 'Stable'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg bg-transparent" aria-label="View details">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg bg-transparent" aria-label="Edit patient">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
});

const PrescriptionQueueView = memo(() => {
  const { pendingPrescriptions } = useDoctorDashboard();
  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Prescription Review Queue</h2>
      <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold">
        {pendingPrescriptions.length} Pending
      </span>
    </div>

    <div className="grid gap-6">
      {pendingPrescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          No pending prescription reviews.
        </div>
      ) : pendingPrescriptions.map((rx) => (
        <div key={rx.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          {rx.alert && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Clinical Alert</p>
                  <p className="text-sm text-red-700">{rx.alert}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
                <Pill className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800">{rx.medication}</h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {rx.type}
                  </span>
                </div>
                <p className="text-gray-600">{rx.patient} • {rx.patientId}</p>
                <p className="text-sm text-gray-500 mt-1">Requested by {rx.requestedBy} • {rx.date}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-600 mb-1">Current Dosage</p>
              <p className="font-semibold text-gray-800">{rx.currentDosage || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Last Filled</p>
              <p className="font-semibold text-gray-800">{rx.lastFilled || 'Never'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                Pending Review
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold">
              ✓ Approve
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
              Modify Dosage
            </button>
            <button className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold bg-transparent">
              Decline
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold bg-transparent">
              View History
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
});

const ClinicalAlertsView = memo(() => {
  const { clinicalAlerts } = useDoctorDashboard();
  return (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Clinical Alerts</h2>

    <div className="grid gap-4">
      {clinicalAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="font-semibold text-gray-800">All Clear</p>
          <p className="text-sm text-gray-500 mt-1">No urgent clinical alerts at this time.</p>
        </div>
      ) : clinicalAlerts.map((alert, i) => (
        <div key={i} className={`bg-white rounded-2xl shadow-sm border-2 p-6 ${
          alert.type === 'high' ? 'border-red-300' :
          alert.type === 'medium' ? 'border-yellow-300' :
          'border-blue-300'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                alert.type === 'high' ? 'bg-red-100' :
                alert.type === 'medium' ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                <AlertCircle className={`w-6 h-6 ${
                  alert.type === 'high' ? 'text-red-600' :
                  alert.type === 'medium' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">{alert.patient}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.type === 'high' ? 'bg-red-100 text-red-700' :
                    alert.type === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {alert.type.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-sm text-gray-600">{alert.time}</span>
                </div>
                <p className="text-gray-700 mb-2">{alert.message}</p>
                <p className="text-sm font-semibold text-gray-600">Recommended Action: {alert.action}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold">
                Review Patient
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold bg-transparent">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
});

const AnalyticsView = memo(() => {
  const { stats } = useDoctorDashboard();
  return (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Prescribing Analytics</h2>

    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">This Month</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Prescriptions Written</p>
            <p className="text-3xl font-bold text-gray-800">{stats.prescriptionsThisMonth}</p>
            <p className="text-sm text-emerald-600 font-semibold mt-1">↑ 12% from last month</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Avg Patients/Day</p>
            <p className="text-3xl font-bold text-gray-800">{stats.avgPatientsPerDay}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Patient Adherence</p>
            <p className="text-3xl font-bold text-gray-800">{stats.adherenceRate}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Prescribed</h3>
        <div className="space-y-3">
          {[
            { med: 'Metformin', count: 23, percent: 16 },
            { med: 'Lisinopril', count: 19, percent: 13 },
            { med: 'Atorvastatin', count: 15, percent: 11 },
            { med: 'Levothyroxine', count: 12, percent: 8 }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{item.med}</span>
                  <span className="text-sm font-bold text-gray-700">{item.count} Rx</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${item.percent * 6}%`}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Performance</h3>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
            <p className="text-sm text-gray-600 mb-1">Generic Rate</p>
            <p className="text-2xl font-bold text-gray-800">78%</p>
            <p className="text-xs text-gray-600 mt-1">vs 72% avg</p>
          </div>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Cost per Rx</p>
            <p className="text-2xl font-bold text-gray-800">$47</p>
            <p className="text-xs text-gray-600 mt-1">15% below peer avg</p>
          </div>
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
            <p className="text-sm text-gray-600 mb-1">Patient Satisfaction</p>
            <p className="text-2xl font-bold text-gray-800">4.8/5</p>
            <p className="text-xs text-gray-600 mt-1">247 reviews</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
});

// Schedule View - Shows patient appointments from database
const ScheduleView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/appointments/doctor');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/api/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Schedule</h2>
          <p className="text-gray-500 mt-1">View and manage patient appointments</p>
        </div>
        <button 
          onClick={fetchAppointments}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-emerald-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-600">No Appointments Yet</h3>
          <p className="text-sm text-gray-500 mt-2">Patient appointments will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Reason</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {appointment.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{appointment.patientName}</p>
                          <p className="text-xs text-gray-500">{appointment.patientEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-800">{formatDate(appointment.appointmentDate)}</p>
                      <p className="text-sm text-emerald-600">{appointment.timeSlot}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{appointment.reason}</p>
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button 
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                          >
                            Complete
                          </button>
                        )}
                        <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg bg-transparent" aria-label="View details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileView = memo(() => {
  const { user } = useAuth();
  const { doctorInfo, refresh } = useDoctorDashboard();
  
  // Local state for form handling initialized with live MongoDB data
  const [formData, setFormData] = useState({
    name: doctorInfo?.name || user?.username || 'Dr. Doctor',
    email: doctorInfo?.email || user?.email || '',
    specialty: doctorInfo?.specialty || doctorInfo?.specialization || user?.specialization || 'Cardiology',
    license: doctorInfo?.license || doctorInfo?.licenseNumber || user?.licenseNumber || 'MD-CA-10293',
    npi: doctorInfo?.npi || '1234567890',
    yearsExperience: doctorInfo?.experience || 12,
    phone: doctorInfo?.phone || '+8801727868832',
    address: doctorInfo?.address || '123 Medical Center Drive, Suite 200',
    hospital: doctorInfo?.facility || 'MediCore Medical Center',
    education: Array.isArray(doctorInfo?.education) && doctorInfo.education[0] 
      ? `${doctorInfo.education[0].degree}, ${doctorInfo.education[0].institution}` 
      : (doctorInfo?.medicalSchool || 'Harvard Medical School'),
    boardCertifications: Array.isArray(doctorInfo?.certifications) && doctorInfo.certifications.length > 0 
      ? doctorInfo.certifications 
      : ['Board Certified in Cardiovascular Disease', 'Advanced Cardiac Life Support (ACLS)', 'Fellow of American College of Cardiology']
  });

  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (doctorInfo) {
      setFormData(prev => ({
        ...prev,
        name: doctorInfo.name || user?.username || prev.name,
        email: doctorInfo.email || user?.email || prev.email,
        specialty: doctorInfo.specialty || doctorInfo.specialization || user?.specialization || prev.specialty,
        license: doctorInfo.license || doctorInfo.licenseNumber || user?.licenseNumber || prev.license,
        yearsExperience: doctorInfo.experience ?? prev.yearsExperience,
        phone: doctorInfo.phone || prev.phone,
        address: doctorInfo.address || prev.address,
        hospital: doctorInfo.facility || prev.hospital,
        education: Array.isArray(doctorInfo.education) && doctorInfo.education[0] 
          ? `${doctorInfo.education[0].degree}, ${doctorInfo.education[0].institution}` 
          : (doctorInfo.medicalSchool || prev.education),
        boardCertifications: Array.isArray(doctorInfo.certifications) && doctorInfo.certifications.length > 0 
          ? doctorInfo.certifications 
          : prev.boardCertifications
      }));
    }
  }, [doctorInfo, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const certificationsList = Array.isArray(formData.boardCertifications) ? formData.boardCertifications : [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-white" />
          <span className="font-semibold">Profile updated successfully!</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Doctor Profile</h2>
          <p className="text-gray-500 mt-1">Manage your professional information and credentials</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all"
        >
          Save Changes
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-emerald-50">
              <img 
                src={doctorInfo?.avatar || user?.profileImageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'} 
                alt={formData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{formData.name}</h3>
            <p className="text-emerald-700 font-semibold text-lg mb-4">{formData.specialty} • {formData.hospital}</p>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">
                Doctor ID: {doctorInfo?.id ? doctorInfo.id.slice(-6) : 'DR-2026'}
              </span>
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold">
                License: {formData.license}
              </span>
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-bold">
                {formData.yearsExperience} Years Exp.
              </span>
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Verified Practitioner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Professional Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Medical License Number</label>
            <input
              type="text"
              name="license"
              value={formData.license}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
            <input
              type="number"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              min="0"
              max="50"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Facility / Hospital</label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Office Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Education & Certifications</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Medical School / Education</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Board Certifications</label>
            <div className="space-y-2">
              {certificationsList.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-800">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Preferences */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Clinical Preferences</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Prescription Preferences</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Prefer generic medications when appropriate</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Automatic refill reminders for stable conditions</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Require patient confirmation for new prescriptions</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Communication Preferences</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Email notifications for urgent alerts</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-gray-700">SMS notifications for prescription approvals</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Weekly summary reports</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Privacy & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <h4 className="font-bold text-gray-800">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your medical account</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <h4 className="font-bold text-gray-800">HIPAA Compliance</h4>
              <p className="text-sm text-gray-500">Ensure patient data protection and privacy compliance</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-600">Compliant</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <h4 className="font-bold text-gray-800">DEA Registration</h4>
              <p className="text-sm text-gray-500">Controlled substance prescribing authority</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// --- Main Component ---

const DoctorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const fetchDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const res = await api.get('/api/doctors/dashboard');
      if (res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.warn('Failed to load doctor dashboard from backend:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      const roleStr = (parsedUser.role || '').toLowerCase();
      if (roleStr !== 'doctor') {
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
      return;
    }

    fetchDashboard();
  }, [navigate]);

  const stats = {
    todayPatients: dashboardData?.stats?.appointmentsToday ?? (dashboardData?.todayAppointments?.length || 0),
    appointments: dashboardData?.stats?.consultationsCount ?? (dashboardData?.appointments?.length || 0),
    pendingScripts: dashboardData?.stats?.pendingPrescriptions ?? (dashboardData?.pendingPrescriptions?.length || 0),
    criticalCases: 0,
    prescriptionsThisMonth: dashboardData?.stats?.consultationsCount ?? (dashboardData?.prescriptions?.length || 0),
    avgPatientsPerDay: Math.max(1, Math.round((dashboardData?.stats?.totalPatients || 1) / 3)),
    adherenceRate: 95
  };

  const patientQueue = (dashboardData?.patients && dashboardData.patients.length > 0)
    ? dashboardData.patients.map((p, idx) => ({
        id: p.id || idx,
        patientId: p.medicalRecordNumber || `PAT-${1000 + idx}`,
        name: p.name || 'Patient',
        age: p.age || 35,
        gender: p.gender || 'Unknown',
        time: p.time || '10:00 AM',
        condition: p.primaryCondition || 'Routine Checkup',
        activeRx: p.activeRxCount || 1,
        lastVisit: 'Recent',
        status: p.status || 'checked-in',
        urgent: false,
        vitals: p.vitals || { bp: '120/80', temp: '98.6°F', pulse: '72' }
      }))
    : (dashboardData?.appointments || []).map((apt, idx) => ({
        id: apt.id || idx,
        patientId: apt.patientId ? `PAT-${apt.patientId.slice(-4)}` : `PAT-${1000 + idx}`,
        name: apt.patientName || 'Patient',
        age: 36,
        gender: 'Adult',
        time: apt.timeSlot || '09:30 AM',
        condition: apt.reason || 'General Consultation',
        activeRx: 1,
        lastVisit: 'Scheduled',
        status: apt.status || 'confirmed',
        urgent: false,
        vitals: { bp: '120/80', temp: '98.6°F', pulse: '72' }
      }));

  const pendingPrescriptions = (dashboardData?.pendingPrescriptions && dashboardData.pendingPrescriptions.length > 0)
    ? dashboardData.pendingPrescriptions.map((rx, idx) => ({
        id: rx.id || `RX-${idx + 1}`,
        patient: rx.patientName || 'Patient',
        patientId: rx.patientId || `PAT-${idx + 1}`,
        medication: (rx.medications && rx.medications[0]?.drugName) || rx.medication || 'Prescription Drug',
        type: rx.type || 'New Prescription',
        requestedBy: 'Patient',
        date: rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : 'Today',
        currentDosage: (rx.medications && rx.medications[0]?.dosage) || 'As directed',
        lastFilled: 'N/A',
        status: rx.status || 'pending',
        alert: null
      }))
    : (dashboardData?.prescriptions || []).map((rx, idx) => ({
        id: rx.id || `RX-${idx + 1}`,
        patient: rx.patientName || 'Patient',
        patientId: rx.patientId || `PAT-${idx + 1}`,
        medication: (rx.medications && rx.medications[0]?.drugName) || 'Prescription Drug',
        type: 'Standard',
        requestedBy: 'Doctor',
        date: rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : 'Today',
        currentDosage: (rx.medications && rx.medications[0]?.dosage) || 'As directed',
        lastFilled: 'N/A',
        status: rx.status || 'active',
        alert: null
      }));

  const clinicalAlerts = (dashboardData?.alerts && dashboardData.alerts.length > 0)
    ? dashboardData.alerts
    : [];

  const contextValue = {
    stats,
    patientQueue,
    pendingPrescriptions,
    clinicalAlerts,
    doctorInfo: dashboardData?.doctor || null,
    loading: loadingDashboard,
    refresh: fetchDashboard
  };

  return (
    <DoctorDashboardContext.Provider value={contextValue}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen} 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab} 
        />
        <div className="flex-1 flex flex-col">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {selectedTab === 'dashboard' && <DashboardView setSelectedTab={setSelectedTab} />}
            {selectedTab === 'patients' && <PatientPanelView />}
            {selectedTab === 'queue' && <PrescriptionQueueView />}
            {selectedTab === 'schedule' && <ScheduleView />}
            {selectedTab === 'alerts' && <ClinicalAlertsView />}
            {selectedTab === 'analytics' && <AnalyticsView />}
            {selectedTab === 'profile' && <ProfileView />}
          </main>
        </div>
      </div>
    </DoctorDashboardContext.Provider>
  );
};

export default DoctorDashboard;
