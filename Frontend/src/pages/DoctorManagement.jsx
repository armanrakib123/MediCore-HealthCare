import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Edit, User, Phone, Mail, MapPin, 
  Star, Calendar, Plus, ArrowLeft, Eye, Settings,
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  Building2, Award, Clock, Video, PhoneCall
} from 'lucide-react';

export default function DoctorManagement() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  // Complete doctors database
  const doctorsDatabase = {
    'p1': {
      id: 'p1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      facility: 'MediCore Medical Center',
      address: '123 Medical Plaza, Downtown',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcare.com',
      experience: 15,
      rating: 4.9,
      reviews: 234,
      patientsServed: '5000+',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      verified: true,
      acceptsNewPatients: true,
      lastUpdated: '2024-12-01',
      consultationFee: 150,
      languages: ['English', 'Spanish', 'French'],
      services: ['Cardiac Catheterization', 'Coronary Angioplasty', 'Stent Placement']
    },
    'p2': {
      id: 'p2',
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      subSpecialty: 'Child Development',
      facility: 'Children\'s Hospital',
      address: '456 Pediatric Way, Children\'s District',
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@healthcare.com',
      experience: 12,
      rating: 4.8,
      reviews: 189,
      patientsServed: '3200+',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      verified: true,
      acceptsNewPatients: true,
      lastUpdated: '2024-11-28',
      consultationFee: 120,
      languages: ['English', 'Mandarin', 'Cantonese'],
      services: ['Well-Child Visits', 'Developmental Screenings', 'Behavioral Assessments']
    },
    'p3': {
      id: 'p3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      subSpecialty: 'Cosmetic Dermatology',
      facility: 'Skin Care Center',
      address: '789 Dermatology Blvd, Beauty District',
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@healthcare.com',
      experience: 8,
      rating: 4.7,
      reviews: 156,
      patientsServed: '2100+',
      avatar: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      verified: true,
      acceptsNewPatients: false,
      lastUpdated: '2024-11-25',
      consultationFee: 140,
      languages: ['English', 'Spanish'],
      services: ['Skin Cancer Screening', 'Acne Treatment', 'Botox & Fillers']
    },
    'p4': {
      id: 'p4',
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      subSpecialty: 'Sports Medicine',
      facility: 'MediCore Medical Center',
      address: '123 Medical Plaza, Downtown',
      phone: '+1 (555) 456-7890',
      email: 'james.wilson@healthcare.com',
      experience: 20,
      rating: 4.9,
      reviews: 298,
      patientsServed: '4500+',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      verified: true,
      acceptsNewPatients: true,
      lastUpdated: '2024-12-03',
      consultationFee: 180,
      languages: ['English'],
      services: ['Knee Arthroscopy', 'Shoulder Reconstruction', 'Sports Injury Treatment']
    },
    'p5': {
      id: 'p5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Neurology',
      subSpecialty: 'Headache & Migraine',
      facility: 'Brain & Spine Institute',
      address: '321 Neurology Center, Medical District',
      phone: '+1 (555) 567-8901',
      email: 'lisa.thompson@healthcare.com',
      experience: 14,
      rating: 4.8,
      reviews: 201,
      patientsServed: '3800+',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      verified: true,
      acceptsNewPatients: true,
      lastUpdated: '2024-11-30',
      consultationFee: 160,
      languages: ['English', 'French'],
      services: ['Migraine Treatment', 'Chronic Headache Management', 'Botox for Headaches']
    },
    'p6': {
      id: 'p6',
      name: 'Dr. Robert Davis',
      specialty: 'General Medicine',
      subSpecialty: 'Family Practice',
      facility: 'Primary Care Clinic',
      address: '654 Family Health Ave, Community Center',
      phone: '+1 (555) 678-9012',
      email: 'robert.davis@healthcare.com',
      experience: 18,
      rating: 4.6,
      reviews: 145,
      patientsServed: '5500+',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      verified: true,
      acceptsNewPatients: true,
      lastUpdated: '2024-11-27',
      consultationFee: 100,
      languages: ['English', 'Spanish'],
      services: ['Annual Physicals', 'Preventive Care', 'Chronic Disease Management']
    }
  };

  const doctors = Object.values(doctorsDatabase);
  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  const filteredDoctors = doctors.filter(doc => {
    const matchesQuery = query === '' || 
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(query.toLowerCase()) ||
      doc.facility.toLowerCase().includes(query.toLowerCase());
    
    const matchesSpecialty = filterSpecialty === 'all' || doc.specialty === filterSpecialty;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesQuery && matchesSpecialty && matchesStatus;
  });

  const doctorsPerPage = 6;
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + doctorsPerPage);

  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctors(prev => 
      prev.includes(doctorId) 
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDoctors.length === paginatedDoctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(paginatedDoctors.map(doc => doc.id));
    }
  };

  const handleEditDoctor = (doctorId) => {
    navigate(`/admin/doctors/edit/${doctorId}`);
  };

  const handleViewDoctor = (doctorId) => {
    navigate(`/doctor-profile/${doctorId}`);
  };

  const getStatusBadge = (status, verified, acceptsNewPatients) => {
    if (!verified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
          <XCircle className="w-3 h-3" />
          Unverified
        </span>
      );
    }
    
    if (status === 'inactive') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
          <XCircle className="w-3 h-3" />
          Inactive
        </span>
      );
    }
    
    if (acceptsNewPatients) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
        <Clock className="w-3 h-3" />
        Not Accepting
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Admin
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
            </div>
            <button
              onClick={() => navigate('/admin/doctors/add')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter(d => d.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter(d => d.verified).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors by name, specialty, or facility..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Specialties</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDoctors.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedDoctors.length} doctor{selectedDoctors.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Bulk Edit
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Deactivate
                </button>
                <button 
                  onClick={() => setSelectedDoctors([])}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {paginatedDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedDoctors.includes(doctor.id)}
                      onChange={() => handleSelectDoctor(doctor.id)}
                      className="absolute top-2 left-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-xl object-cover ml-6"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
                    <p className="text-gray-500 text-sm">{doctor.subSpecialty}</p>
                    <div className="mt-2">
                      {getStatusBadge(doctor.status, doctor.verified, doctor.acceptsNewPatients)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{doctor.facility}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{doctor.experience}y</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">${doctor.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDoctor(doctor.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditDoctor(doctor.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Last updated: {new Date(doctor.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + doctorsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or add a new doctor</p>
            <button
              onClick={() => {
                setQuery('');
                setFilterSpecialty('all');
                setFilterStatus('all');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}