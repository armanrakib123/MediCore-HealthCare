import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Activity, Pill, Calendar, FileText, Bell, Settings, LogOut, 
  UserCircle, Menu, X, Home, Clock, CheckCircle, Package, Phone,
  MapPin, Download, ChevronRight, AlertCircle, TrendingUp, Shield,
  Search, Filter, MoreVertical, Plus, Upload, MessageCircle
} from 'lucide-react';
import Avatar from '../components/Avatar';
import api from '../api/api';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const normalizeMedication = (med) => ({
    drugName: med?.drugName || med?.DrugName || med?.name || 'Medication',
    dosage: med?.dosage || med?.Dosage || med?.dose || 'N/A',
    frequency: med?.frequency || med?.Frequency || 'N/A',
    instructions: med?.instructions || med?.Instructions || '',
    quantity: med?.quantity || med?.Quantity || ''
  });

  const extractRxId = (text = '') => {
    const match = text.match(/RX-[A-Za-z0-9-]+/);
    return match ? match[0] : null;
  };

  const getReadyPrescriptionIds = () => {
    try {
      const stored = localStorage.getItem('notifications');
      const notifications = stored ? JSON.parse(stored) : [];
      return new Set(
        notifications
          .filter((n) => /prescription ready/i.test(n?.title || '') || /ready for pickup/i.test(n?.message || ''))
          .map((n) => extractRxId(`${n?.title || ''} ${n?.message || ''}`))
          .filter(Boolean)
      );
    } catch (error) {
      console.error('Failed to read notifications for ready status', error);
      return new Set();
    }
  };

  const normalizePrescription = (rx, readyIds = new Set()) => {
    const medicationsRaw = Array.isArray(rx?.medications)
      ? rx.medications
      : Array.isArray(rx?.Medications)
      ? rx.Medications
      : [];
    const medications = medicationsRaw.map(normalizeMedication);
    const createdAt = rx?.createdAt || rx?.CreatedAt || new Date().toISOString();
    const status = rx?.status || rx?.Status || 'Pending';
    const prescriptionNumber = rx?.prescriptionNumber || rx?.PrescriptionNumber || rx?.id || rx?.Id || '';
    const id = rx?.id || rx?.Id || rx?.prescriptionId || rx?.PrescriptionId || prescriptionNumber || `RX-${Date.now()}`;

    return {
      ...rx,
      id,
      status: readyIds.has(prescriptionNumber) || readyIds.has(id) ? 'Ready' : status,
      createdAt,
      prescriptionNumber,
      prescriptionSource: rx?.prescriptionSource || rx?.PrescriptionSource || 'Uploaded',
      imageData: rx?.imageData || rx?.ImageData || null,
      imageFileName: rx?.imageFileName || rx?.ImageFileName || null,
      pharmacyName: rx?.pharmacyName || rx?.PharmacyName || '',
      pharmacyPhone: rx?.pharmacyPhone || rx?.PharmacyPhone || rx?.pharmacyContact || rx?.PharmacyContact || '',
      whatsAppNumber: rx?.whatsAppNumber || rx?.WhatsAppNumber || rx?.pharmacyWhatsApp || rx?.PharmacyWhatsApp || rx?.pharmacyWhatsAppNumber || rx?.PharmacyWhatsAppNumber || '',
      notes: rx?.notes || rx?.Notes || '',
      medications,
      medication: rx?.medication || medications[0]?.drugName || 'Prescription',
      prescribedBy: rx?.prescribedBy || rx?.PrescribedBy || rx?.doctorName || rx?.DoctorName || 'N/A',
      daysSupplyLeft: rx?.daysSupplyLeft || rx?.DaysSupplyLeft || 0,
      refillsRemaining: rx?.refillsRemaining || rx?.RefillsRemaining || 0
    };
  };

  const normalizePrescriptions = (list = []) => {
    const readyIds = getReadyPrescriptionIds();
    return (list || []).map((rx) => normalizePrescription(rx, readyIds))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/', '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'Patient') { // Patient role should be 'Patient'
      navigate('/');
      return;
    }
    
    setUser(parsedUser);
    loadDashboardData();
    fetchAppointments();
    fetchPrescriptions();
  }, [navigate]);

  useEffect(() => {
    const applyReadyStatusFromNotifications = () => {
      const readyIds = getReadyPrescriptionIds();
      if (readyIds.size === 0) return;
      setPrescriptions((prev) => prev.map((rx) => (
        readyIds.has(rx.prescriptionNumber) || readyIds.has(rx.id)
          ? { ...rx, status: 'Ready' }
          : rx
      )));
    };

    applyReadyStatusFromNotifications();

    const handleNotificationsUpdate = () => applyReadyStatusFromNotifications();
    const handleStorage = (event) => {
      if (event.key === 'notifications') {
        applyReadyStatusFromNotifications();
      }
    };

    window.addEventListener('notificationsUpdate', handleNotificationsUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('notificationsUpdate', handleNotificationsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const loadDashboardData = async () => {
    setLoadingDashboard(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, using demo data');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await api.get('/api/patients/dashboard', config);
      const data = response.data;
      
      if (data && data.Patient) {
        setPatientData(data.Patient);
        setHealthMetrics(data.HealthMetrics);
        
        // Update prescriptions if we got them from dashboard
        if (data.Prescriptions) {
          setPrescriptions(normalizePrescriptions(data.Prescriptions));
        }
      }
    } catch (error) {
      console.warn('Dashboard API failed (likely expired token), using demo data:', error.message);
      // Load demo data if API fails (could be expired token, network issues, etc.)
      setPatientData({
        BloodType: 'O+',
        Allergies: [],
        ChronicConditions: []
      });
      setHealthMetrics({
        adherenceRate: 85,
        totalPrescriptions: prescriptions.length,
        activeMedications: prescriptions.filter(p => p.status === 'Approved' || p.status === 'Dispensed').length,
        appointmentsThisMonth: appointments.filter(a => new Date(a.AppointmentDate).getMonth() === new Date().getMonth()).length,
        bloodPressure: '120/80',
        bloodPressureStatus: 'normal',
        bloodGlucose: '95',
        glucoseStatus: 'normal',
        weight: '70',
        weightTrend: 'stable'
      });
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchPrescriptions = async () => {
    setLoadingPrescriptions(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found for prescriptions API');
        setPrescriptions([]);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        const response = await api.get('/api/patients/prescriptions', config);
        setPrescriptions(normalizePrescriptions(response.data || []));
      } catch (apiError) {
        console.warn('Prescriptions API failed, loading from localStorage:', apiError.message);
        setPrescriptions([]);
      }
    } catch (error) {
      console.warn('Prescriptions fetch failed (likely expired token):', error.message);
      setPrescriptions([]);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No token found for appointments API');
        setAppointments([]);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await api.get('/api/appointments/patient', config);
      setAppointments(response.data || []);
    } catch (error) {
      console.warn('Appointments API failed (likely expired token):', error.message);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Patient data (merged with real user data where possible)
  const patientInfo = {
    name: user?.username || 'Patient',
    email: user?.email || 'patient@email.com',
    id: user?.id ? `PAT-${user.id.slice(-5)}` : 'PAT-00000',
    age: patientData?.User?.DateOfBirth ?
      Math.floor((new Date() - new Date(patientData.User.DateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) :
      30,
    bloodType: patientData?.BloodType || 'O+',
    avatar: user?.username ? user.username.substring(0, 2).toUpperCase() : 'PT',
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
    allergies: patientData?.Allergies || [],
    chronicConditions: patientData?.ChronicConditions || []
  };

  // Use real prescriptions from API
  const displayPrescriptions = prescriptions.length > 0 ? prescriptions : [
    {
      id: 'RX-0001',
      medication: 'No prescriptions found',
      dosage: 'N/A',
      prescribedBy: 'N/A',
      specialty: 'N/A',
      refillsRemaining: 0,
      refillsTotal: 0,
      daysSupplyLeft: 0,
      status: 'none',
      lastFilled: 'N/A',
      expiryDate: 'N/A'
    }
  ];

  // Today's medication schedule (generated from real prescriptions)
  const todaySchedule = prescriptions.slice(0, 4).map((rx, index) => {
    const medication = rx.medications?.[0] || { drugName: 'No medication', dosage: 'N/A' };
    return {
      time: ['8:00 AM', '2:00 PM', '8:00 PM', '9:00 PM'][index] || '8:00 AM',
      medication: medication.drugName,
      dosage: medication.dosage,
      status: index === 0 ? 'taken' : index === 1 ? 'upcoming' : 'pending',
      takenAt: index === 0 ? '8:15 AM' : undefined
    };
  });

  // Use real health metrics from API
  const displayHealthMetrics = healthMetrics || {
    adherenceRate: 0,
    totalPrescriptions: prescriptions.length,
    activeMedications: prescriptions.filter(p => p.status === 'Approved' || p.status === 'Dispensed').length,
    appointmentsThisMonth: appointments.filter(a => new Date(a.AppointmentDate).getMonth() === new Date().getMonth()).length,
    bloodPressure: 'N/A',
    bloodPressureStatus: 'unknown',
    bloodGlucose: 'N/A',
    glucoseStatus: 'unknown',
    weight: 'N/A',
    weightTrend: 'stable'
  };

  // Pharmacy info
  const pharmacy = {
    name: 'MediCare Pharmacy',
    branch: 'Downtown Branch',
    phone: '(555) 123-4567',
    email: 'orders@medicare.com',
    address: '123 Main Street, Downtown',
    hours: '8:00 AM - 8:00 PM',
    distance: '1.2 miles away'
  };

  // Navigation menu
  const navigation = [
    { icon: Home, label: 'Dashboard', value: 'dashboard' },
    { icon: Pill, label: 'My Prescriptions', value: 'prescriptions' },
    { icon: Calendar, label: 'Appointments', value: 'appointments' },
    { icon: Activity, label: 'Health Metrics', value: 'health' },
    { icon: FileText, label: 'Medical Records', value: 'records' },
    { icon: Package, label: 'Pharmacy', value: 'pharmacy' },
    { icon: UserCircle, label: 'Profile', value: 'profile' }
  ];

  // Sidebar Component
  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100 transition-transform duration-300 flex flex-col shadow-xl lg:shadow-none h-[calc(100vh-64px)] top-16`}>
        
        {/* Patient info card */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                 {user ? <Avatar user={user} size="medium" /> : patientInfo.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{patientInfo.name}</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{patientInfo.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Age</p>
                <p className="font-bold text-gray-700">{patientInfo.age}</p>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Blood</p>
                <p className="font-bold text-gray-700">{patientInfo.bloodType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedTab(item.value)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  selectedTab === item.value
                    ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${
                  selectedTab === item.value ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
                {selectedTab === item.value && (
                  <ChevronRight className="w-4 h-4 ml-auto text-emerald-600" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Help section */}
        <div className="p-4 border-t border-gray-50">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
            <Shield className="w-8 h-8 text-emerald-100 mb-3 relative z-10" />
            <h4 className="font-bold text-white mb-1 relative z-10">Need Help?</h4>
            <p className="text-xs text-emerald-100 mb-3 relative z-10 opacity-90">Our support team is available 24/7 to assist you.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2.5 rounded-xl text-xs font-bold transition-colors relative z-10 border border-white/20">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-emerald-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-4 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Health Status: Good
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Welcome back, {patientInfo.name.split(' ')[0]}! 👋</h2>
            <p className="text-emerald-100 text-lg max-w-xl leading-relaxed">Your health journey is on track. You have <span className="font-bold text-white">2 upcoming appointments</span> and <span className="font-bold text-white">1 prescription</span> to refill.</p>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setSelectedTab('appointments')}
                className="bg-white text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all transform hover:-translate-y-0.5"
              >
                View Schedule
              </button>
              <button className="bg-emerald-700/50 hover:bg-emerald-700/70 backdrop-blur-md text-white px-6 py-2.5 rounded-xl font-bold text-sm border border-white/10 transition-all">
                Refill Prescriptions
              </button>
              <button 
                onClick={() => navigate('/doctors')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
              >
                Book Appointment
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Calendar className="w-16 h-16 text-white opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
              <Calendar className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">Confirmed</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Next Appointment</h3>
          <p className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">Nov 25, 10:30 AM</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 mb-4">
            <UserCircle className="w-4 h-4" />
            <span>Dr. Chen - Endocrinology</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedTab('appointments')}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 shadow-md"
            >
              View All
            </button>
            <button 
              onClick={() => navigate('/doctors')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Book New
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-100 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
              <Pill className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">2 Urgent</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Active Medications</h3>
          <p className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">{displayHealthMetrics.activeMedications} Prescriptions</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span>2 refills needed soon</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
              <Activity className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">Excellent</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Adherence Rate</h3>
          <p className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{displayHealthMetrics.adherenceRate}%</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Top 5% of patients</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Medication Schedule */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Today's Schedule</h2>
              <p className="text-sm text-gray-500 mt-1">Track your daily medications</p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            {todaySchedule.map((item, index) => (
              <div key={index} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                item.status === 'taken' ? 'border-green-100 bg-green-50/30' :
                item.status === 'upcoming' ? 'border-blue-100 bg-blue-50/30 shadow-sm' :
                'border-gray-100 bg-gray-50/50 opacity-70'
              }`}>
                <div className="flex items-center gap-6">
                  <div className={`w-16 text-center py-2 rounded-xl ${
                    item.status === 'taken' ? 'bg-green-100 text-green-700' :
                    item.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <p className="font-bold text-sm">{item.time.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold uppercase">{item.time.split(' ')[1]}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{item.medication}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 font-medium">{item.dosage}</span>
                      {item.status === 'taken' && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">Taken at {item.takenAt}</span>
                      )}
                    </div>
                  </div>
                </div>
                {item.status === 'taken' ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                ) : item.status === 'upcoming' ? (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                    Mark Taken
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Health Metrics */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Vitals</h2>
              <p className="text-sm text-gray-500 mt-1">Latest measurements</p>
            </div>
            <button onClick={() => setSelectedTab('health')} className="text-emerald-600 text-sm font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Blood Pressure</span>
                </div>
                <span className="bg-white text-green-700 px-2 py-1 rounded-lg text-xs font-bold shadow-sm border border-green-100">
                  {displayHealthMetrics.bloodPressureStatus}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{displayHealthMetrics.bloodPressure}</p>
              <p className="text-xs text-gray-500 mt-1">Last checked: 2 days ago</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <Activity className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Blood Glucose</span>
                </div>
                <span className="bg-white text-green-700 px-2 py-1 rounded-lg text-xs font-bold shadow-sm border border-green-100">
                  {displayHealthMetrics.glucoseStatus}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{displayHealthMetrics.bloodGlucose}</p>
              <p className="text-xs text-gray-500 mt-1">Last checked: Today, 8:00 AM</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Weight</span>
                </div>
                <span className="bg-white text-blue-700 px-2 py-1 rounded-lg text-xs font-bold shadow-sm border border-blue-100">
                  {displayHealthMetrics.weightTrend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{displayHealthMetrics.weight}</p>
              <p className="text-xs text-gray-500 mt-1">Last checked: 1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Prescriptions & Pharmacy */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Prescriptions */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Active Prescriptions</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your medications</p>
            </div>
            <button onClick={() => setSelectedTab('prescriptions')} className="text-emerald-600 text-sm font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {prescriptions.slice(0, 3).map((rx) => (
              <div key={rx.id} className="group p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-gray-100 border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Pill className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{rx.medication}</h3>
                      <p className="text-xs text-gray-500 font-medium">By {rx.prescribedBy}</p>
                    </div>
                  </div>
                  {rx.status === 'refill-needed' && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      Refill Soon
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm pl-16">
                  <span className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-lg group-hover:bg-gray-50 transition-colors">{rx.daysSupplyLeft} days left</span>
                  <span className="text-gray-400 text-xs">{rx.refillsRemaining} refills remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pharmacy Info */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Preferred Pharmacy</h2>
              <p className="text-sm text-gray-500 mt-1">Your pickup location</p>
            </div>
            <button className="text-emerald-600 text-sm font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
              Change
            </button>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Package className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{pharmacy.name}</h3>
                <p className="text-gray-600 font-medium mb-4">{pharmacy.branch}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-white/60 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-cyan-600" />
                    <span className="font-medium">{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-white/60 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    <span className="font-medium">{pharmacy.distance} • {pharmacy.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-white/60 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    <span className="font-medium">{pharmacy.hours}</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-cyan-200 transition-all">
                    Call Now
                  </button>
                  <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-bold text-sm border border-gray-200 shadow-sm transition-all">
                    Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Prescriptions View
  const PrescriptionsView = () => (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Prescriptions</h2>
          <p className="text-gray-500 mt-1">Manage and track your medications</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {loadingPrescriptions ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100">
            <Pill className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Prescriptions Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">You haven't uploaded any prescriptions. Visit a pharmacy or ask your doctor to send a prescription.</p>
            <button 
              onClick={() => navigate('/pharmacy')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Prescription
            </button>
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div key={rx.id} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100/50 overflow-hidden">
              {/* Status Bar */}
              <div className={`h-2 transition-colors duration-300 ${
                rx.status === 'Dispensed' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : rx.status === 'Ready'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                  : rx.status === 'Approved'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : rx.status === 'Pending'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
              }`} />
              
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div className="flex items-start gap-6">
                    {/* Icon/Image */}
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg ${
                      rx.status === 'Dispensed' || rx.status === 'Approved'
                        ? 'bg-gradient-to-br from-emerald-100 to-teal-100'
                        : rx.status === 'Ready'
                        ? 'bg-gradient-to-br from-emerald-100 to-green-100'
                        : rx.status === 'Pending'
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100'
                        : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                    }`}>
                      {rx.imageData ? (
                        <img 
                          src={rx.imageData.startsWith('data:') ? rx.imageData : `data:image/jpeg;base64,${rx.imageData}`} 
                          alt="Prescription" 
                          className="w-full h-full object-cover rounded-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
                        />
                      ) : (
                        <Pill className={`w-12 h-12 ${
                          rx.status === 'Dispensed' || rx.status === 'Approved'
                            ? 'text-emerald-600'
                            : rx.status === 'Ready'
                            ? 'text-emerald-600'
                            : rx.status === 'Pending'
                            ? 'text-gray-600'
                            : 'text-blue-600'
                        }`} />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {rx.medications?.length > 0 ? rx.medications[0].drugName : 'Prescription'}
                        </h3>
                      </div>

                      {rx.pharmacyName && (
                        <div className="flex items-center justify-between gap-3 text-sm text-emerald-700 font-medium mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{rx.pharmacyName}</span>
                          </div>
                          <button
                            onClick={openWhatsApp}
                            className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 hover:bg-green-200 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                            title={`Chat with ${rx.pharmacyName} on WhatsApp`}
                            aria-label={`Chat with ${rx.pharmacyName} on WhatsApp`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </button>
                        </div>
                      )}

                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-3 ${
                        rx.status === 'Dispensed'
                          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300'
                          : rx.status === 'Ready'
                          ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-300'
                          : rx.status === 'Approved'
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300'
                          : rx.status === 'Pending'
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-300'
                          : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300'
                      }`}>
                        {rx.status}
                      </div>
                      
                      {/* Dosage & Frequency */}
                      {rx.medications?.length > 0 && (
                        <p className="text-lg font-semibold text-gray-700 mb-1">
                          {rx.medications[0].dosage} • {rx.medications[0].frequency}
                        </p>
                      )}
                      
                      {/* Pharmacy & Notes */}
                      <div className="space-y-2 mt-3">
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex gap-3 w-full md:w-auto">
                    {rx.status === 'Pending' ? (
                      <>
                        <button className="flex-1 md:flex-none bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:shadow-xl active:scale-[0.98] active:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                          Under Review
                        </button>
                        <button onClick={async () => {
                          if (!window.confirm('Are you sure you want to cancel this prescription?')) {
                            return;
                          }

                          const prescriptionId = rx?.id || rx?.Id || rx?.prescriptionId || rx?.PrescriptionId;
                          const isObjectId = typeof prescriptionId === 'string' && /^[a-f0-9]{24}$/i.test(prescriptionId);
                          if (!isObjectId) {
                            alert('Unable to cancel this prescription right now.');
                            return;
                          }

                          try {
                            const token = localStorage.getItem('token');
                            if (!token) {
                              alert('Please log in again.');
                              return;
                            }

                            await api.delete(`/api/patients/prescriptions/${prescriptionId}`, {
                              headers: { Authorization: `Bearer ${token}` }
                            });

                            setPrescriptions((prev) => prev.filter(p => p.id !== rx.id));
                          } catch (error) {
                            console.warn('Cancel prescription failed:', error?.message || error);
                            alert('Unable to cancel this prescription right now.');
                          }
                        }} className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-xl active:scale-[0.98] active:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                          Cancel
                        </button>
                      </>
                    ) : rx.status === 'Ready' ? (
                      <button className="flex-1 md:flex-none bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all transform hover:scale-105">
                        Ready for Pickup
                      </button>
                    ) : rx.status === 'Approved' ? (
                      <button className="flex-1 md:flex-none bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-105">
                        View Details
                      </button>
                    ) : rx.status === 'Dispensed' ? (
                      <button className="flex-1 md:flex-none bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all transform hover:scale-105">
                        View Details
                      </button>
                    ) : (
                      <button className="flex-1 md:flex-none border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3.5 rounded-2xl font-bold transition-all transform hover:scale-105">
                        View Details
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gradient-to-br from-white via-emerald-50/60 to-emerald-100/50 rounded-2xl border border-emerald-200/70 shadow-sm">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-white border border-blue-200 shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Source
                    </p>
                    <p className="font-bold text-gray-900 truncate text-base">{rx.prescriptionSource || 'Generated'}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1 truncate">{rx.prescriptionNumber}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-white border border-emerald-200 shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Status
                    </p>
                    <p className="font-bold text-gray-900 text-base">{rx.status}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Updated</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-100 to-white border border-cyan-200 shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-500" />
                      Uploaded
                    </p>
                    <p className="font-bold text-gray-900 text-base">{new Date(rx.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{new Date(rx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-white border border-purple-200 shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      Notes
                    </p>
                    {rx.notes ? (
                      <div className="cursor-pointer" onClick={() => {
                        setSelectedNote({ note: rx.notes, image: rx.imageData });
                        setShowNoteModal(true);
                      }}>
                        <span className="font-bold text-gray-900 text-base hover:text-purple-600 transition-colors">View Note</span>
                      </div>
                    ) : (
                      <p className="font-bold text-gray-900 text-base">None</p>
                    )}
                    <p className="text-xs text-gray-500 font-medium mt-1">from prescription</p>
                  </div>
                </div>

                {/* Medications Included */}
                {rx.medications && rx.medications.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4">Medications Included:</h4>
                    <div className="space-y-3">
                      {rx.medications.map((med, idx) => (
                        <div key={idx} className="flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          <div>
                            <p className="font-semibold text-gray-800">{med.drugName}</p>
                            <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                            {med.instructions && (
                              <p className="text-sm text-gray-500 mt-1">📋 {med.instructions}</p>
                            )}
                          </div>
                          <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap border border-emerald-200">Qty: {med.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Appointments View with real data
  const AppointmentsView = () => {
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

    const handleCancelAppointment = async (appointmentId) => {
      if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
      try {
        await api.delete(`/api/appointments/${appointmentId}`);
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    };

    return (
      <div className="space-y-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Appointments</h2>
            <p className="text-gray-500 mt-1">View and manage your scheduled appointments</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/doctors')}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Book New Appointment
            </button>
          </div>
        </div>

        {loadingAppointments ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-600">No Appointments Yet</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">Book your first appointment with a doctor</p>
            <button 
              onClick={() => navigate('/doctors')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{appointment.doctorName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">{appointment.doctorSpecialty}</p>
                      <p className="text-sm text-gray-500 mt-1">Reason: {appointment.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">{formatDate(appointment.appointmentDate)}</p>
                      <p className="text-emerald-600 font-semibold">{appointment.timeSlot}</p>
                    </div>
                    {appointment.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md border border-red-400"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600"><span className="font-semibold">Notes:</span> {appointment.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const HealthMetricsView = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Activity className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-600">Health Metrics</h3>
      <p className="text-sm mt-2">This section is under development.</p>
    </div>
  );

  const PharmacyView = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Package className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-600">Pharmacy</h3>
      <p className="text-sm mt-2">This section is under development.</p>
    </div>
  );

  const MedicalRecordsView = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileText className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-600">Medical Records</h3>
      <p className="text-sm mt-2">This section is under development.</p>
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all">
          Edit Profile
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              {user ? (
                <Avatar 
                  user={user} 
                  size="xlarge" 
                  className="w-full h-full"
                  defaultAvatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-bold">
                  {patientInfo.avatar}
                </div>
              )}
            </div>
            <button className="absolute bottom-2 right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl shadow-lg transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{patientInfo.name}</h3>
            <p className="text-gray-600 text-lg mb-4">{patientInfo.email}</p>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">
                Patient ID: {patientInfo.id}
              </span>
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold">
                Member since {patientInfo.memberSince}
              </span>
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-bold">
                Age: {patientInfo.age}
              </span>
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-bold">
                Blood Type: {patientInfo.bloodType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={patientInfo.name}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={patientInfo.email}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              defaultValue="1990-01-15"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Blood Type</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+" selected>O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Contact</label>
            <input
              type="text"
              defaultValue="Jane Johnson (Spouse) - +1 (555) 987-6543"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Health Preferences */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Health Preferences</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Allergies</label>
            <div className="flex flex-wrap gap-2">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm">Penicillin</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm">Shellfish</span>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm transition-colors">
                + Add Allergy
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Current Medications</label>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">Metformin 500mg</span>
                <span className="text-sm text-gray-500">Twice daily</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">Lisinopril 10mg</span>
                <span className="text-sm text-gray-500">Once daily</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Preferred Pharmacy</label>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-bold text-gray-800">{pharmacy.name}</p>
                  <p className="text-sm text-gray-600">{pharmacy.address}</p>
                </div>
              </div>
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
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <h4 className="font-bold text-gray-800">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive updates about appointments and prescriptions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {selectedTab === 'dashboard' && <DashboardView />}
          {selectedTab === 'prescriptions' && <PrescriptionsView />}
          {selectedTab === 'appointments' && <AppointmentsView />}
          {selectedTab === 'health' && <HealthMetricsView />}
          {selectedTab === 'pharmacy' && <PharmacyView />}
          {selectedTab === 'records' && <MedicalRecordsView />}
          {selectedTab === 'profile' && <ProfileView />}
        </main>
        
        {/* Floating Action Button for Quick Booking */}
        <button
          onClick={() => navigate('/doctors')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 group transform hover:scale-110"
          title="Book New Appointment"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Note Modal */}
      {showNoteModal && selectedNote && (
        <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setShowNoteModal(false)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-8 py-6 bg-gradient-to-r from-purple-50 to-white">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Prescription Details</h2>
                <p className="text-sm text-gray-500 mt-1">View your prescription image and medical notes</p>
              </div>
            </div>

            {/* Modal Content - Two Column Layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Side - Prescription Image */}
              {selectedNote.image && (
                <div className="w-1/2 bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 p-8 flex flex-col overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Prescription Image</h3>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow flex-1">
                    <img 
                      src={selectedNote.image.startsWith('data:') ? selectedNote.image : `data:image/jpeg;base64,${selectedNote.image}`}
                      alt="Prescription"
                      className="max-w-full h-auto rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Right Side - Doctor's Note */}
              {selectedNote.note && (
                <div className="w-1/2 bg-gradient-to-b from-purple-50 to-white p-8 flex flex-col overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Doctor's Note</h3>
                  </div>
                  <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-lg flex-1">
                    <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap font-medium">{selectedNote.note}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-8 py-6 bg-gradient-to-r from-white to-gray-50 flex justify-end">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;