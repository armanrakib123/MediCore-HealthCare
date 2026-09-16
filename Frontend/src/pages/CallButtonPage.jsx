import api from '../api/api';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Phone, Video, MessageSquare, Calendar, Clock, 
  Star, CheckCircle, AlertCircle, Info, X,
  Shield, Zap, Heart, Award, ChevronRight, ArrowLeft
} from 'lucide-react';

export default function CallButtonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId } = useParams();
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState(''); // 'voice' or 'video'
  const [connecting, setConnecting] = useState(false);

  const resolvedDoctorId = doctorId || location.state?.doctorId || null;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        if (resolvedDoctorId) {
          const res = await api.get(`/api/doctors/${resolvedDoctorId}`);
          if (res.data) {
            setDoctor(res.data);
            return;
          }
        }
        const resAll = await api.get('/api/doctors');
        if (Array.isArray(resAll.data) && resAll.data.length > 0) {
          setDoctor(resAll.data[0]);
        }
      } catch (err) {
        console.error('Error fetching doctor in CallButtonPage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [resolvedDoctorId]);

  const handleCallClick = (type) => {
    setCallType(type);
    setShowCallModal(true);
  };

  const handleConfirmCall = () => {
    setConnecting(true);
    setTimeout(() => {
      // Navigate to appropriate call interface
      if (callType === 'video') {
        navigate('/video-call', { state: { doctorId: resolvedDoctorId } });
      } else {
        // For voice calls, you could navigate to a voice call page or show a different interface
        navigate('/voice-call', { state: { doctorId: resolvedDoctorId } });
      }
      setConnecting(false);
    }, 2000);
  };

  const handleBackToProfile = () => {
    navigate(`/doctor-profile/${resolvedDoctorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={handleBackToProfile}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Secure Connection</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Doctor Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
                    <p className="text-blue-100 text-lg mb-1">{doctor.specialty}</p>
                    <p className="text-blue-200 text-sm">{doctor.subSpecialty}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                      <span className="font-bold text-xl">{doctor.rating}</span>
                      <span className="text-blue-100 text-sm">({doctor.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <p className="text-blue-100 text-xs mb-1">Experience</p>
                    <p className="font-bold">{doctor.experience} years</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <p className="text-blue-100 text-xs mb-1">Patients</p>
                    <p className="font-bold">{doctor.patientsServed}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <p className="text-blue-100 text-xs mb-1">Success Rate</p>
                    <p className="font-bold">{doctor.successRate}%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <p className="text-blue-100 text-xs mb-1">Languages</p>
                    <p className="font-bold text-sm">{doctor.languages.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Voice Call Card */}
          <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                Voice Call
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Connect with your doctor through a high-quality voice call. Perfect for quick consultations and follow-ups.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Crystal clear audio quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Secure & private connection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Lower data usage</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                  <p className="text-3xl font-bold text-gray-900">${doctor.consultationFee}</p>
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                  POPULAR
                </div>
              </div>

              <button
                onClick={() => handleCallClick('voice')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-emerald-200"
              >
                <Phone className="w-5 h-5" />
                Start Voice Call
              </button>
            </div>
          </div>

          {/* Video Call Card */}
          <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Video Call
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Face-to-face consultation with your doctor. Get a more comprehensive examination experience.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>HD video quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Visual examination capability</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Screen sharing available</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                  <p className="text-3xl font-bold text-gray-900">${doctor.videoConsultationFee}</p>
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  RECOMMENDED
                </div>
              </div>

              <button
                onClick={() => handleCallClick('video')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-blue-200"
              >
                <Video className="w-5 h-5" />
                Start Video Call
              </button>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate(`/doctor-profile/${resolvedDoctorId}`)}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 hover:border-purple-200 transition-all duration-300 text-left group"
          >
            <MessageSquare className="w-10 h-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900 mb-2">Send Message</h4>
            <p className="text-sm text-gray-600">Ask questions via chat</p>
            <ChevronRight className="w-5 h-5 text-gray-400 mt-4 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
          </button>

          <button 
            onClick={() => navigate('/appointment-booking', { state: { doctor: doctor, source: 'call-page' } })}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300 text-left group"
          >
            <Calendar className="w-10 h-10 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900 mb-2">Schedule Later</h4>
            <p className="text-sm text-gray-600">Book for a specific time</p>
            <ChevronRight className="w-5 h-5 text-gray-400 mt-4 group-hover:text-orange-600 group-hover:translate-x-2 transition-all" />
          </button>

          <button className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 hover:border-pink-200 transition-all duration-300 text-left group">
            <Heart className="w-10 h-10 text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900 mb-2">Emergency</h4>
            <p className="text-sm text-gray-600">Urgent medical assistance</p>
            <ChevronRight className="w-5 h-5 text-gray-400 mt-4 group-hover:text-pink-600 group-hover:translate-x-2 transition-all" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">How it works</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Select your preferred call type (Voice or Video)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Wait for the doctor to join (usually within 2 minutes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Complete your consultation and receive prescription if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Payment is processed securely after the call</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowCallModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className={`w-20 h-20 ${callType === 'video' ? 'bg-blue-100' : 'bg-emerald-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {callType === 'video' ? (
                  <Video className={`w-10 h-10 ${callType === 'video' ? 'text-blue-600' : 'text-emerald-600'}`} />
                ) : (
                  <Phone className={`w-10 h-10 ${callType === 'voice' ? 'text-emerald-600' : 'text-blue-600'}`} />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm {callType === 'video' ? 'Video' : 'Voice'} Call
              </h3>
              <p className="text-gray-600">
                You're about to start a {callType} call with Dr. {doctor.name.split(' ')[1]}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor</span>
                <span className="font-semibold text-gray-900">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-gray-900">
                  {callType === 'video' ? 'Video Consultation' : 'Voice Call'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee</span>
                <span className="font-bold text-gray-900 text-lg">
                  ${callType === 'video' ? doctor.videoConsultationFee : doctor.consultationFee}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Please ensure you're in a quiet location with good internet connection for the best experience.
              </p>
            </div>

            {connecting ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Connecting to doctor...</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCallModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCall}
                  className={`flex-1 px-6 py-3 ${
                    callType === 'video'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                  } text-white rounded-xl font-bold shadow-lg transition-all`}
                >
                  Start Call
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}