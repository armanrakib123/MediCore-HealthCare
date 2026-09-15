import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Phone, Mail, Star, Calendar, 
  MessageSquare, User, Award, Clock, ChevronRight, Stethoscope,
  Heart, Video, Building2, GraduationCap, ArrowRight, ChevronDown, Sparkles
} from 'lucide-react';

export default function BeautifulDoctorsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filterFacility, setFilterFacility] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [favorites, setFavorites] = useState([]);

  // Mock data
  const doctors = [
    { 
      id: "p1", 
      name: "Dr. Sarah Johnson", 
      specialty: "Cardiology", 
      subSpecialty: "Interventional Cardiology",
      facility: "MediCore Medical Center", 
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@healthcare.com",
      experience: 15,
      rating: 4.9,
      reviews: 234,
      nextAvailable: "Today, 2:00 PM",
      consultationFee: "$150",
      languages: ["English", "Spanish"],
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      verified: true,
      acceptsNewPatients: true
    },
    { 
      id: "p2", 
      name: "Dr. Michael Chen", 
      specialty: "Pediatrics", 
      subSpecialty: "Child Development",
      facility: "Children's Hospital", 
      phone: "+1 (555) 234-5678",
      email: "michael.chen@healthcare.com",
      experience: 12,
      rating: 4.8,
      reviews: 189,
      nextAvailable: "Tomorrow, 10:00 AM",
      consultationFee: "$120",
      languages: ["English", "Mandarin"],
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
      verified: true,
      acceptsNewPatients: true
    },
    { 
      id: "p3", 
      name: "Dr. Emily Rodriguez", 
      specialty: "Dermatology", 
      subSpecialty: "Cosmetic Dermatology",
      facility: "Skin Care Center", 
      phone: "+1 (555) 345-6789",
      email: "emily.rodriguez@healthcare.com",
      experience: 8,
      rating: 4.7,
      reviews: 156,
      nextAvailable: "Dec 10, 3:00 PM",
      consultationFee: "$140",
      languages: ["English", "Spanish"],
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      verified: true,
      acceptsNewPatients: false
    },
    { 
      id: "p4", 
      name: "Dr. James Wilson", 
      specialty: "Orthopedics", 
      subSpecialty: "Sports Medicine",
      facility: "MediCore Medical Center", 
      phone: "+1 (555) 456-7890",
      email: "james.wilson@healthcare.com",
      experience: 20,
      rating: 4.9,
      reviews: 298,
      nextAvailable: "Today, 4:30 PM",
      consultationFee: "$180",
      languages: ["English"],
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
      verified: true,
      acceptsNewPatients: true
    },
    { 
      id: "p5", 
      name: "Dr. Lisa Thompson", 
      specialty: "Neurology", 
      subSpecialty: "Headache & Migraine",
      facility: "Brain & Spine Institute", 
      phone: "+1 (555) 567-8901",
      email: "lisa.thompson@healthcare.com",
      experience: 14,
      rating: 4.8,
      reviews: 201,
      nextAvailable: "Tomorrow, 11:00 AM",
      consultationFee: "$160",
      languages: ["English", "French"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      verified: true,
      acceptsNewPatients: true
    },
    { 
      id: "p6", 
      name: "Dr. Robert Davis", 
      specialty: "General Medicine", 
      subSpecialty: "Family Practice",
      facility: "Primary Care Clinic", 
      phone: "+1 (555) 678-9012",
      email: "robert.davis@healthcare.com",
      experience: 18,
      rating: 4.6,
      reviews: 145,
      nextAvailable: "Today, 5:00 PM",
      consultationFee: "$100",
      languages: ["English"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      verified: true,
      acceptsNewPatients: true
    }
  ];

  const facilities = Array.from(new Set(doctors.map(d => d.facility)));
  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  const filteredDoctors = doctors.filter(doc => {
    const matchesQuery = query === '' || 
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(query.toLowerCase());
    const matchesFacility = filterFacility === 'all' || doc.facility === filterFacility;
    const matchesSpecialty = filterSpecialty === 'all' || doc.specialty === filterSpecialty;
    return matchesQuery && matchesFacility && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-violet-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-violet-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-violet-400/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-emerald-100 text-sm mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/facilities" className="hover:text-white transition-colors">Facilities</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Doctors</span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full mb-6 border border-white/30">
              <Stethoscope className="w-4 h-4" />
              <span className="text-sm font-semibold">Find Your Perfect Doctor</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Expert Healthcare <br />
              <span className="text-emerald-200">Professionals</span>
            </h1>
            
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Connect with top-rated specialists and book appointments in minutes. Your health journey starts here.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col lg:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, specialty, or condition..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-gray-800"
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Doctors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Filters:</span>
              </div>
              
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none bg-white"
              >
                <option value="all">All Specialties</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <select
                value={filterFacility}
                onChange={(e) => setFilterFacility(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none bg-white"
              >
                <option value="all">All Facilities</option>
                {facilities.map(fac => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none bg-white"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="reviews">Most Reviewed</option>
                <option value="available">Next Available</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">{filteredDoctors.length}</span> doctors found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2"
            >
              {/* Doctor Image */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-emerald-100 to-violet-100">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  {doctor.verified && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Award className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                  <button 
                    onClick={() => {
                      setFavorites(prev => 
                        prev.includes(doctor.id) 
                          ? prev.filter(id => id !== doctor.id)
                          : [...prev, doctor.id]
                      );
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-colors shadow-lg"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(doctor.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-800">{doctor.rating}</span>
                      <span className="text-sm text-gray-600">({doctor.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold text-sm mb-1">{doctor.specialty}</p>
                  <p className="text-gray-500 text-sm">{doctor.subSpecialty}</p>
                </div>

                {/* Key Info */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{doctor.facility}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">Next: {doctor.nextAvailable}</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {doctor.languages.map((lang, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Fee & Status */}
                <div className="flex items-center justify-between mb-5 p-3 bg-gradient-to-r from-emerald-50 to-violet-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Consultation Fee</p>
                    <p className="text-lg font-bold text-gray-800">{doctor.consultationFee}</p>
                  </div>
                  {doctor.acceptsNewPatients && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      Accepting Patients
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button 
                    onClick={() => window.open(`tel:${doctor.phone}`, '_self')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl font-semibold text-sm transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button 
                    onClick={() => navigate('/call-selection', { state: { doctorId: doctor.id } })}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-semibold text-sm transition-all"
                  >
                    <Video className="w-4 h-4" />
                    Video Call
                  </button>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      navigate(`/doctor-profile/${doctor.id}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    View Profile
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/appointment-booking', { 
                        state: { 
                          doctor: doctor,
                          source: 'doctors-list'
                        } 
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-700 hover:to-violet-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setQuery('');
                setFilterFacility('all');
                setFilterSpecialty('all');
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Enhanced CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-violet-600 rounded-3xl p-12 lg:p-16 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-violet-400/20"></div>
          <div 
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-16 -mb-16 blur-3xl"
          ></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-300 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-violet-300 rotate-45 animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ready to find the right care?</h2>
            <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
              Search for doctors, explore facilities, or contact us for help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-4 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find a Doctor
              </button>
              <button className="px-10 py-4 bg-transparent text-white hover:bg-white hover:text-emerald-600 rounded-xl font-bold border-2 border-white transition-all duration-300 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Find a Pharmacy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}