import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Star, Users, Award, Calendar, 
  Eye, Sparkles, Heart, CheckCircle, 
  GraduationCap, Shield, Video, Phone,
  ChevronRight, ArrowLeft, Globe
} from 'lucide-react';

export default function DoctorProfileDemo() {
  const navigate = useNavigate();

  const handleStartVideoCall = (doctorId) => {
    navigate('/call-selection', { state: { doctorId: doctorId } });
  };

  const doctors = [
    {
      id: 'p1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      facility: 'MediCore Medical Center',
      experience: 15,
      rating: 4.9,
      reviews: 234,
      patientsServed: '5000+',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p2',
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      subSpecialty: 'Child Development',
      facility: 'Children\'s Hospital',
      experience: 12,
      rating: 4.8,
      reviews: 189,
      patientsServed: '3200+',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      subSpecialty: 'Cosmetic Dermatology',
      facility: 'Skin Care Center',
      experience: 8,
      rating: 4.7,
      reviews: 156,
      patientsServed: '2100+',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p4',
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      subSpecialty: 'Sports Medicine',
      facility: 'Orthopedic Sports Center',
      experience: 18,
      rating: 4.8,
      reviews: 312,
      patientsServed: '4200+',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Neurology',
      subSpecialty: 'Stroke Treatment',
      facility: 'Neurological Institute',
      experience: 14,
      rating: 4.9,
      reviews: 278,
      patientsServed: '3800+',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p6',
      name: 'Dr. Robert Martinez',
      specialty: 'Gastroenterology',
      subSpecialty: 'Hepatology',
      facility: 'Digestive Health Center',
      experience: 11,
      rating: 4.6,
      reviews: 198,
      patientsServed: '2900+',
      avatar: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const features = [
    'Beautiful gradient backgrounds with animations',
    'Interactive tabs (About, Education, Services, Reviews)',
    'Enhanced booking system with real-time availability',
    'Advanced patient reviews with helpful voting',
    'Professional achievements & publications',
    'Medical philosophy & credentials section',
    'Comprehensive insurance & language info',
    'Premium animations & hover effects',
    'Mobile-responsive design',
    'Previous/Next doctor navigation',
    'Enhanced loading states & error handling',
    'Professional certification display'
  ];

  const renderFeatureCard = () => {
    return (
      <div className="relative bg-white rounded-3xl shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 hover:shadow-2xl">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          PREMIUM FEATURES
        </div>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2 text-blue-800">
              Beautiful Doctor Profiles
            </h3>
            <p className="text-gray-600">
              Enhanced user experience with advanced features and modern design
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            {doctors.slice(0, 2).map((doctor) => (
              <div key={doctor.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{doctor.experience} years exp.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              navigate(`/doctor-profile/${doctors[0].id}`);
            }}
            className="w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
          >
            <Eye className="w-5 h-5" />
            View Doctor Profile
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-800 text-xl">Doctor Profile Demo</span>
          </div>
          
          <button 
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            All Doctors
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Beautiful Doctor Profiles</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Experience our premium doctor profile with enhanced features, beautiful design, 
              and comprehensive information display. See what makes our profiles special.
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-300" />
                <span className="text-blue-100">6+ Doctors Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-300" />
                <span className="text-blue-100">High-Rated Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-300" />
                <span className="text-blue-100">Certified Specialists</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Features Overview */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Premium Doctor Profile Features</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience our enhanced doctor profile with beautiful design, advanced features, and comprehensive information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          {renderFeatureCard()}
        </div>

        {/* Available Doctors */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Doctors</h2>
            <p className="text-gray-600">Try the premium profile with any of our featured doctors</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="text-center mb-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{doctor.name}</h3>
                  <p className="text-blue-600 font-semibold mb-1">{doctor.specialty}</p>
                  <p className="text-gray-600 text-sm mb-3">{doctor.subSpecialty}</p>
                  
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{doctor.patientsServed}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Board Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">{doctor.facility}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleStartVideoCall(doctor.id)}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Video Call Now
                  </button>
                  <button
                    onClick={() => navigate(`/doctor-profile/${doctor.id}`)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    View Profile
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Detailed Education</h3>
            <p className="text-gray-600 text-sm">Complete academic background and certifications</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Smart Booking</h3>
            <p className="text-gray-600 text-sm">Advanced appointment scheduling with real-time availability</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Patient Reviews</h3>
            <p className="text-gray-600 text-sm">Authentic patient feedback and ratings system</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Achievements</h3>
            <p className="text-gray-600 text-sm">Professional recognition and accomplishments</p>
          </div>
        </div>
      </div>
    </div>
  );
}