import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Pill, Calendar, Bell, Settings, LogOut, UserCircle, Menu, X, Home, 
  Clock, CheckCircle, Package, Phone, ShoppingCart, DollarSign, AlertCircle,
  Search, Filter, Download, TrendingUp, BarChart3, MapPin, Mail, Plus, Eye,
  MessageCircle,
  ChevronRight, Shield
} from 'lucide-react';
import Avatar from '../components/Avatar';
import api from '../api/api';

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [queuePrescriptions, setQueuePrescriptions] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [selectedQueueRx, setSelectedQueueRx] = useState(null);
  const [startFillRx, setStartFillRx] = useState(null);
  const [fillSuccess, setFillSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      // Check for correct pharmacist role from backend API
      if (parsedUser.role !== 'Pharmacist') {
        console.log('User role not pharmacist:', parsedUser.role);
        navigate('/');
        return;
      }
      
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const normalizeQueuePrescription = (rx) => {
    const medicationsRaw = Array.isArray(rx?.medications)
      ? rx.medications
      : Array.isArray(rx?.Medications)
      ? rx.Medications
      : [];

    const medications = medicationsRaw.map((med) => ({
      drugName: med?.drugName || med?.DrugName || med?.name || 'Medication',
      dosage: med?.dosage || med?.Dosage || 'N/A',
      frequency: med?.frequency || med?.Frequency || 'N/A'
    }));

    return {
      id: rx?.id || rx?.Id || rx?.prescriptionId || rx?.PrescriptionId || rx?.prescriptionNumber || rx?.PrescriptionNumber,
      prescriptionNumber: rx?.prescriptionNumber || rx?.PrescriptionNumber,
      status: rx?.status || rx?.Status || 'Pending',
      createdAt: rx?.createdAt || rx?.CreatedAt || new Date().toISOString(),
      imageData: rx?.imageData || rx?.ImageData || null,
      notes: rx?.notes || rx?.Notes || '',
      pharmacyName: rx?.pharmacyName || rx?.PharmacyName || pharmacyInfo.name,
      medications
    };
  };

  const fetchQueuePrescriptions = async () => {
    setQueueLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setQueuePrescriptions([]);
        return;
      }

      const response = await api.get('/api/pharmacists/prescriptions');
      const list = Array.isArray(response?.data) ? response.data : [];
      const normalized = list.map(normalizeQueuePrescription)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQueuePrescriptions(normalized);
    } catch (error) {
      console.warn('Failed to fetch pharmacy prescriptions:', error?.message || error);
      setQueuePrescriptions([]);
    } finally {
      setQueueLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchQueuePrescriptions();
  }, [user]);

  const notifyPatientReady = (rx) => {
    try {
      const stored = localStorage.getItem('notifications');
      const existing = stored ? JSON.parse(stored) : [];
      const newNotification = {
        id: `rx-ready-${Date.now()}`,
        title: 'Prescription ready',
        message: `Your prescription ${rx.prescriptionNumber || rx.id} is ready for pickup.`,
        time: 'Just now',
        type: 'pharmacy',
        link: '/patient-dashboard',
        read: false
      };
      const updated = [newNotification, ...existing];
      localStorage.setItem('notifications', JSON.stringify(updated));
      window.dispatchEvent(new Event('notificationsUpdate'));
    } catch (error) {
      console.error('Failed to update notifications', error);
    }
  };

  const handleStartFillConfirm = () => {
    if (!startFillRx) return;
    setQueuePrescriptions((prev) => prev.map((rx) => (
      rx.id === startFillRx.id ? { ...rx, status: 'Ready' } : rx
    )));
    notifyPatientReady(startFillRx);
    setFillSuccess({
      title: 'Order is ready',
      message: 'Patient notified that the prescription is ready for pickup.'
    });
    setStartFillRx(null);
    setTimeout(() => setFillSuccess(null), 3500);
  };

  const handleOpenWhatsAppChat = () => {
    window.open('https://wa.me/', '_blank', 'noopener,noreferrer');
  };

  // Pharmacy data
  const pharmacyInfo = {
    name: user?.username || 'MediCare Pharmacy',
    branch: 'Downtown Branch',
    email: user?.email || 'orders@medicare.com',
    id: 'PHR-023',
    phone: '(555) 123-4567',
    whatsAppNumber: import.meta.env.VITE_PHARMACY_WHATSAPP || '',
    address: '123 Main Street, Downtown',
    avatar: user?.username ? user.username.substring(0, 2).toUpperCase() : 'MP',
    license: 'PH-98765'
  };

  // Fulfillment queue data
  const fulfillmentQueue = [
    {
      id: 'RX-5847',
      patient: 'Sarah Johnson',
      patientId: 'PAT-10847',
      medication: 'Metformin 500mg',
      quantity: '60 tablets',
      doctor: 'Dr. Michael Chen',
      insurance: 'BlueCross',
      insuranceStatus: 'verified',
      priority: 'urgent',
      timeAgo: '2 hours ago',
      status: 'ready-to-fill',
      copay: '$10'
    },
    {
      id: 'RX-5848',
      patient: 'Michael Brown',
      patientId: 'PAT-10849',
      medication: 'Lisinopril 10mg',
      quantity: '30 tablets',
      doctor: 'Dr. Sarah Williams',
      insurance: 'Aetna',
      insuranceStatus: 'pending',
      priority: 'standard',
      timeAgo: '3 hours ago',
      status: 'insurance-review',
      copay: '$15'
    },
    {
      id: 'RX-5849',
      patient: 'Emily Davis',
      patientId: 'PAT-10851',
      medication: 'Albuterol Inhaler 90mcg',
      quantity: '1 inhaler',
      doctor: 'Dr. James Lee',
      insurance: 'Medicare',
      insuranceStatus: 'verified',
      priority: 'urgent',
      timeAgo: '4 hours ago',
      status: 'ready-to-fill',
      copay: '$5'
    }
  ];

  // Ready for pickup
  const readyForPickup = [
    {
      id: 'RX-5840',
      patient: 'John Smith',
      patientId: 'PAT-10835',
      medications: ['Atorvastatin 20mg', 'Aspirin 81mg'],
      filledDate: '2 days ago',
      filledTime: '10:30 AM',
      status: 'overdue',
      total: '$25.50',
      notified: true
    },
    {
      id: 'RX-5845',
      patient: 'Lisa Anderson',
      patientId: 'PAT-10841',
      medications: ['Levothyroxine 50mcg'],
      filledDate: 'Today',
      filledTime: '11:00 AM',
      status: 'ready',
      total: '$12.00',
      notified: true
    },
    {
      id: 'RX-5846',
      patient: 'Robert Wilson',
      patientId: 'PAT-10843',
      medications: ['Omeprazole 20mg', 'Vitamin D3'],
      filledDate: '5 days ago',
      filledTime: '2:15 PM',
      status: 'critical',
      total: '$18.75',
      notified: false
    }
  ];

  // Inventory data
  const inventory = [
    { id: 1, name: 'Metformin 500mg', category: 'Diabetes', stock: 450, reorderLevel: 100, price: '$12.50', status: 'good' },
    { id: 2, name: 'Lisinopril 10mg', category: 'Blood Pressure', stock: 87, reorderLevel: 100, price: '$8.75', status: 'low' },
    { id: 3, name: 'Albuterol Inhaler', category: 'Respiratory', stock: 12, reorderLevel: 50, price: '$25.00', status: 'critical' },
    { id: 4, name: 'Atorvastatin 20mg', category: 'Cholesterol', stock: 523, reorderLevel: 150, price: '$15.50', status: 'good' },
    { id: 5, name: 'Levothyroxine 50mcg', category: 'Thyroid', stock: 34, reorderLevel: 75, price: '$9.25', status: 'low' }
  ];

  // Stats data
  const stats = {
    ordersToday: 47,
    readyForPickup: 23,
    lowStockItems: 9,
    todayRevenue: 3247,
    weeklyRevenue: 18934,
    averageRxValue: 101.40,
    insuranceRevenue: 2830,
    cashRevenue: 417
  };

  // Navigation menu
  const navigation = [
    { icon: Home, label: 'Dashboard', value: 'dashboard' },
    { icon: ShoppingCart, label: 'Fulfillment Queue', value: 'queue' },
    { icon: Package, label: 'Ready for Pickup', value: 'pickup' },
    { icon: BarChart3, label: 'Inventory', value: 'inventory' },
    { icon: DollarSign, label: 'Revenue Reports', value: 'revenue' },
    { icon: Phone, label: 'Doctor Messages', value: 'messages' },
    { icon: Clock, label: 'Order History', value: 'history' },
    { icon: UserCircle, label: 'Settings', value: 'settings' }
  ];

  // Sidebar Component
  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100 transition-transform duration-300 flex flex-col shadow-xl lg:shadow-none h-[calc(100vh-64px)] top-16`}>
        
        {/* Pharmacy info card */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                 {user ? <Avatar user={user} size="medium" /> : pharmacyInfo.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{pharmacyInfo.name}</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{pharmacyInfo.branch}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Orders</p>
                <p className="font-bold text-gray-700">{stats.ordersToday}</p>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Revenue</p>
                <p className="font-bold text-gray-700">${(stats.todayRevenue/1000).toFixed(1)}K</p>
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
                    ? 'bg-cyan-50 text-cyan-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${
                  selectedTab === item.value ? 'text-cyan-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
                {selectedTab === item.value && (
                  <ChevronRight className="w-4 h-4 ml-auto text-cyan-600" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Contact info */}
        <div className="p-4 border-t border-gray-50">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-cyan-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
            <Package className="w-8 h-8 text-cyan-100 mb-3 relative z-10" />
            <h4 className="font-bold text-white mb-1 relative z-10">Need Support?</h4>
            <p className="text-xs text-cyan-100 mb-3 relative z-10 opacity-90">Contact pharmacy support</p>
            <button
              onClick={handleOpenWhatsAppChat}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2.5 rounded-xl text-xs font-bold transition-colors relative z-10 border border-white/20"
            >
              Get Help
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
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-cyan-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Welcome to {pharmacyInfo.name}! 💊</h2>
            <p className="text-cyan-100 text-lg max-w-xl leading-relaxed">You have <span className="font-bold text-white">{fulfillmentQueue.length} orders</span> in queue and <span className="font-bold text-white">{readyForPickup.length} orders</span> ready for pickup.</p>
          </div>
          <div className="hidden lg:block relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Package className="w-16 h-16 text-white opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-cyan-100 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 transition-colors duration-300">
              <ShoppingCart className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-100">
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-cyan-600 transition-colors">{stats.ordersToday}</p>
          <p className="text-sm text-gray-500 font-medium">Orders Today</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
              <Package className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs font-bold border border-orange-100">
              8 urgent
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{stats.readyForPickup}</p>
          <p className="text-sm text-gray-500 font-medium">Ready for Pickup</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
              <AlertCircle className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-bold border border-red-100">
              Action
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">{stats.lowStockItems}</p>
          <p className="text-sm text-gray-500 font-medium">Low Stock Items</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
              <DollarSign className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">${(stats.todayRevenue/1000).toFixed(1)}K</p>
          <p className="text-sm text-gray-500 font-medium">Today's Revenue</p>
        </div>
      </div>

      {/* Fulfillment Queue */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Fulfillment Queue</h2>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-gray-50">
              <option>All Orders</option>
              <option>Urgent</option>
              <option>Standard</option>
            </select>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-200 transition-all">
              Refresh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {fulfillmentQueue.map((order) => (
            <div key={order.id} className={`p-5 rounded-2xl border transition-all duration-300 ${
              order.priority === 'urgent' ? 'border-red-100 bg-red-50/30' : 'border-gray-100 bg-gray-50/30'
            } hover:shadow-md`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center">
                    {order.priority === 'urgent' ? (
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Pill className="w-6 h-6 text-cyan-600" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wide">{order.timeAgo}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800">{order.id}</h3>
                      {order.priority === 'urgent' && (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                          URGENT
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        order.insuranceStatus === 'verified' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.insurance} - {order.insuranceStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">{order.patient} <span className="text-gray-400">({order.patientId})</span></p>
                    <p className="text-sm text-gray-600">{order.medication} • {order.quantity} • <span className="font-medium text-gray-800">Copay: {order.copay}</span></p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Prescribed by {order.doctor}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Start Filling
                  </button>
                  <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Inventory + Ready for Pickup */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Low Stock Inventory */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Low Stock Alert</h3>
            <button onClick={() => setSelectedTab('inventory')} className="text-cyan-600 text-sm font-bold hover:bg-cyan-50 px-3 py-1.5 rounded-lg transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {inventory.filter(item => item.status !== 'good').slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-bold ${
                      item.status === 'critical' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {item.stock} units
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{item.category}</span>
                  </div>
                </div>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all ${
                  item.status === 'critical' ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' :
                  'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'
                }`}>
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ready for Pickup */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Ready for Pickup</h3>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
              {readyForPickup.length} orders
            </span>
          </div>
          <div className="space-y-3">
            {readyForPickup.slice(0, 3).map((pickup) => (
              <div key={pickup.id} className={`p-4 rounded-2xl border-l-4 ${
                pickup.status === 'critical' ? 'border-red-500 bg-red-50' :
                pickup.status === 'overdue' ? 'border-orange-500 bg-orange-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">{pickup.patient}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Order {pickup.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white rounded-lg text-blue-600 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm shadow-green-200 transition-all">
                      Picked Up
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Inventory View
  const InventoryView = () => (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
        <div className="flex gap-3">
          <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-200 transition-all">
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Medication</th>
                <th className="text-left py-4 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Stock</th>
                <th className="text-left py-4 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Reorder Level</th>
                <th className="text-left py-4 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left py-4 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <Pill className="w-5 h-5 text-cyan-600" />
                      </div>
                      <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm font-medium">{item.category}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-sm ${
                      item.status === 'critical' ? 'text-red-600' :
                      item.status === 'low' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.reorderLevel}</td>
                  <td className="py-4 px-6 text-gray-800 font-bold text-sm">{item.price}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      item.status === 'critical' ? 'bg-red-100 text-red-700' :
                      item.status === 'low' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      {(item.status === 'low' || item.status === 'critical') && (
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all">
                          Reorder
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
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
    </div>
  );

  const FulfillmentQueueView = () => (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fulfillment Queue</h2>
          <p className="text-sm text-gray-500 mt-1">Prescriptions submitted to {pharmacyInfo.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold">
            {queuePrescriptions.filter((rx) => rx.status === 'Pending').length} pending
          </span>
          <button
            onClick={fetchQueuePrescriptions}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-200 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      {queueLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
        </div>
      ) : queuePrescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No prescriptions in queue</h3>
          <p className="text-sm text-gray-500 mt-2">New uploads will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queuePrescriptions.map((rx) => (
            <div key={rx.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                  {rx.imageData ? (
                    <img
                      src={rx.imageData.startsWith('data:') ? rx.imageData : `data:image/jpeg;base64,${rx.imageData}`}
                      alt="Prescription"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Pill className="w-8 h-8 text-cyan-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-800">{rx.prescriptionNumber || rx.id}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      rx.status === 'Ready'
                        ? 'bg-emerald-100 text-emerald-700'
                        :
                      rx.status === 'Dispensed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : rx.status === 'Approved'
                        ? 'bg-blue-100 text-blue-700'
                        : rx.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rx.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {rx.medications.length > 0 ? rx.medications[0].drugName : 'Uploaded prescription'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <span>{new Date(rx.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{new Date(rx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {rx.notes && (
                      <>
                        <span>•</span>
                        <span className="line-clamp-1">{rx.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {rx.status === 'Ready' ? (
                    <button
                      className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-200 transition-all"
                    >
                      Deliver Order
                    </button>
                  ) : (
                    <button
                      onClick={() => setStartFillRx(rx)}
                      className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-200 transition-all"
                    >
                      Start Filling
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedQueueRx(rx)}
                    className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQueueRx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedQueueRx(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
              <div>
                <h3 className="text-lg font-bold">Prescription Details</h3>
                <p className="text-cyan-100 text-sm">{selectedQueueRx.prescriptionNumber || selectedQueueRx.id}</p>
              </div>
              <button
                onClick={() => setSelectedQueueRx(null)}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-28 h-28 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                  {selectedQueueRx.imageData ? (
                    <img
                      src={selectedQueueRx.imageData.startsWith('data:') ? selectedQueueRx.imageData : `data:image/jpeg;base64,${selectedQueueRx.imageData}`}
                      alt="Prescription"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Pill className="w-10 h-10 text-cyan-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                      selectedQueueRx.status === 'Ready'
                        ? 'bg-emerald-100 text-emerald-700'
                        :
                      selectedQueueRx.status === 'Dispensed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selectedQueueRx.status === 'Approved'
                        ? 'bg-blue-100 text-blue-700'
                        : selectedQueueRx.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedQueueRx.status}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(selectedQueueRx.createdAt).toLocaleDateString()} • {new Date(selectedQueueRx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {selectedQueueRx.medications.length > 0 ? selectedQueueRx.medications[0].drugName : 'Uploaded prescription'}
                  </p>
                  {selectedQueueRx.notes && (
                    <p className="text-sm text-gray-500 mt-2">Notes: {selectedQueueRx.notes}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Medications</h4>
                {selectedQueueRx.medications.length > 0 ? (
                  <div className="space-y-2">
                    {selectedQueueRx.medications.map((med, index) => (
                      <div key={index} className="flex items-center justify-between text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                          <span className="font-medium">{med.drugName}</span>
                        </div>
                        <span className="text-gray-500">{med.dosage} • {med.frequency}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Medication details not provided.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedQueueRx(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {startFillRx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setStartFillRx(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <div>
                <h3 className="text-lg font-bold">Start Filling</h3>
                <p className="text-emerald-100 text-sm">{startFillRx.prescriptionNumber || startFillRx.id}</p>
              </div>
              <button
                onClick={() => setStartFillRx(null)}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                aria-label="Close start filling"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900">Ready to begin</h4>
                    <p className="text-sm text-emerald-800 mt-1">
                      Review the prescription and confirm the meds before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Summary</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-semibold">{startFillRx.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Received</span>
                    <span className="font-semibold">
                      {new Date(startFillRx.createdAt).toLocaleDateString()} • {new Date(startFillRx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Primary medication</span>
                    <span className="font-semibold">
                      {startFillRx.medications.length > 0 ? startFillRx.medications[0].drugName : 'Uploaded prescription'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setStartFillRx(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartFillConfirm}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-200 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {fillSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{fillSuccess.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{fillSuccess.message}</p>
            </div>
            <button
              onClick={() => setFillSuccess(null)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close success message"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Ready for Pickup View
  const ReadyForPickupView = () => (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Ready for Pickup Orders</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white">
            <option>All Status</option>
            <option>Ready Today</option>
            <option>Overdue</option>
            <option>Critical</option>
          </select>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-cyan-200 transition-all">
            Send Reminders
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {readyForPickup.map((pickup) => (
          <div key={pickup.id} className={`bg-white rounded-3xl shadow-sm border-2 p-6 ${
            pickup.status === 'critical' ? 'border-red-100' :
            pickup.status === 'overdue' ? 'border-orange-100' :
            'border-green-100'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  pickup.status === 'critical' ? 'bg-red-50' :
                  pickup.status === 'overdue' ? 'bg-orange-50' :
                  'bg-green-50'
                }`}>
                  <Package className={`w-8 h-8 ${
                    pickup.status === 'critical' ? 'text-red-600' :
                    pickup.status === 'overdue' ? 'text-orange-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{pickup.patient}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      pickup.status === 'critical' ? 'bg-red-100 text-red-700' :
                      pickup.status === 'overdue' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {pickup.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{pickup.patientId} • Order {pickup.id}</p>
                  <p className="text-sm text-gray-500 mt-1">Filled {pickup.filledDate} at {pickup.filledTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Medications</h4>
              <div className="space-y-2">
                {pickup.medications.map((med, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                    {med}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Total Amount</span>
                <span className="text-xl font-bold text-gray-800">{pickup.total}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all">
                <CheckCircle className="w-5 h-5" />
                Mark as Picked Up
              </button>
              <button className="border border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                <Phone className="w-4 h-4" />
                Call Patient
              </button>
              <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-all">
                Send SMS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Revenue Reports View
  const RevenueReportsView = () => (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Revenue Reports</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-200 transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Today's Sales</h3>
            <div className="p-2 bg-green-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-800 mb-2">${stats.todayRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 font-bold bg-green-50 inline-block px-2 py-1 rounded-lg">↑ 8% from yesterday</p>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500 font-medium">Orders Filled</span>
              <span className="font-bold text-gray-800">{stats.ordersToday}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Avg Order Value</span>
              <span className="font-bold text-gray-800">${stats.averageRxValue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Weekly Revenue</h3>
            <div className="p-2 bg-blue-50 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-800 mb-2">${stats.weeklyRevenue.toLocaleString()}</p>
          <p className="text-sm text-blue-600 font-bold bg-blue-50 inline-block px-2 py-1 rounded-lg">↑ 12% from last week</p>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500 font-medium">Insurance</span>
              <span className="font-bold text-gray-800">${stats.insuranceRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Cash</span>
              <span className="font-bold text-gray-800">${stats.cashRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Top Products</h3>
            <div className="p-2 bg-purple-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Metformin', revenue: 1240 },
              { name: 'Lisinopril', revenue: 980 },
              { name: 'Atorvastatin', revenue: 850 }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="font-bold text-gray-700 text-sm">{item.name}</span>
                <span className="text-purple-600 font-bold text-sm">${item.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Settings View
  const SettingsView = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Pharmacy Settings</h2>
          <p className="text-gray-500 mt-1">Manage your pharmacy information and preferences</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-cyan-200 transition-all">
          Save Changes
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
                <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                  {pharmacyInfo.avatar}
                </div>
              )}
            </div>
            <button className="absolute bottom-2 right-2 bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-xl shadow-lg transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{pharmacyInfo.name}</h3>
            <p className="text-gray-600 text-lg mb-4">{pharmacyInfo.branch}</p>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-xl text-sm font-bold">
                ID: {pharmacyInfo.id}
              </span>
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold">
                License: {pharmacyInfo.license}
              </span>
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacy Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Pharmacy Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Pharmacy Name</label>
            <input
              type="text"
              defaultValue={pharmacyInfo.name}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Branch Name</label>
            <input
              type="text"
              defaultValue={pharmacyInfo.branch}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={pharmacyInfo.email}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue={pharmacyInfo.phone}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <input
              type="text"
              defaultValue={pharmacyInfo.address}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">License Number</label>
            <input
              type="text"
              defaultValue={pharmacyInfo.license}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Operating Hours</label>
            <input
              type="text"
              defaultValue={pharmacy.hours}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Business Settings</h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Insurance Plans Accepted</label>
              <div className="space-y-2">
                {['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Medicaid'].map((insurance) => (
                  <label key={insurance} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                    <span className="text-sm font-medium text-gray-700">{insurance}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Options</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  <span className="text-sm font-medium text-gray-700">Local Delivery (2 miles)</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <input type="checkbox" className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  <span className="text-sm font-medium text-gray-700">Mail Order</span>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  <span className="text-sm font-medium text-gray-700">Curbside Pickup</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Prescription Processing Time</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all">
              <option>15 minutes</option>
              <option selected>30 minutes</option>
              <option>45 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
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
              <p className="text-sm text-gray-500">Add an extra layer of security to your pharmacy account</p>
            </div>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <h4 className="font-bold text-gray-800">HIPAA Compliance</h4>
              <p className="text-sm text-gray-500">Ensure patient data protection and privacy</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-600">Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Placeholder Views
  const MessagesView = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Phone className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-600">Doctor Messages</h3>
      <p className="text-sm mt-2">This section is under development.</p>
      <button
        onClick={handleOpenWhatsAppChat}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition-all flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Open WhatsApp Chat
      </button>
    </div>
  );

  const HistoryView = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Clock className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-600">Order History</h3>
      <p className="text-sm mt-2">This section is under development.</p>
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading pharmacy dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {selectedTab === 'dashboard' && <DashboardView />}
          {selectedTab === 'queue' && <FulfillmentQueueView />}
          {selectedTab === 'pickup' && <ReadyForPickupView />}
          {selectedTab === 'inventory' && <InventoryView />}
          {selectedTab === 'revenue' && <RevenueReportsView />}
          {selectedTab === 'messages' && <MessagesView />}
          {selectedTab === 'history' && <HistoryView />}
          {selectedTab === 'settings' && <SettingsView />}
        </main>

        <button
          onClick={handleOpenWhatsAppChat}
          className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-xl shadow-green-200 transition-all flex items-center gap-2"
          aria-label="Open WhatsApp chat"
          title="Open WhatsApp chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-bold">WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default PharmacyDashboard;