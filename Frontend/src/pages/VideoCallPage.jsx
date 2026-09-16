import api from '../api/api';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  MessageSquare, Send, Paperclip, Share2, Settings,
  Maximize2, Minimize2, Camera, Monitor, Users,
  Clock, FileText, Image, MoreVertical, ChevronDown,
  Volume2, VolumeX, Calendar, AlertCircle, CheckCircle,
  ArrowLeft, Star, Award, MapPin, Phone as PhoneIcon
} from 'lucide-react';

export default function VideoCallPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId } = useParams(); // Get doctorId from URL params
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [message, setMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [selectedTab, setSelectedTab] = useState('waiting'); // waiting, in-call, ended
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);

  // Load doctor data from MongoDB backend API
  useEffect(() => {
    const loadDoctorData = async () => {
      setLoading(true);
      const resolvedDoctorId = doctorId || location.state?.doctorId || null;
      try {
        let doctorData = null;
        if (resolvedDoctorId) {
          const res = await api.get(`/api/doctors/${resolvedDoctorId}`);
          if (res.data) doctorData = res.data;
        }
        if (!doctorData) {
          const resAll = await api.get('/api/doctors');
          if (Array.isArray(resAll.data) && resAll.data.length > 0) {
            doctorData = resAll.data[0];
          }
        }
        if (doctorData) {
          setDoctor(doctorData);
          setMessages([
            { 
              id: 1, 
              sender: 'doctor', 
              text: `Hello! I'm ${doctorData.name}. I'll be with you shortly for your video consultation.`, 
              time: 'Just now' 
            }
          ]);
        }
      } catch (e) {
        console.error('Failed to load doctor for video call:', e);
      } finally {
        setLoading(false);
      }
    };

    loadDoctorData();
  }, [doctorId, location.state]);

  const handleBackToProfile = () => {
    if (doctor) {
      navigate(`/doctor-profile/${doctor.id}`);
    } else {
      navigate('/doctors');
    }
  };

  // Call timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    setSelectedTab('in-call');
    setCallDuration(0);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setSelectedTab('ended');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'patient',
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Video Call</h3>
          <p className="text-gray-600">Preparing your consultation...</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2 w-64 mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Doctor not found state
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor for this video call doesn't exist or has been removed.</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/doctors')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Waiting Room View
  if (selectedTab === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{doctor.name}</h2>
                    <p className="text-blue-100">{doctor.specialty}</p>
                    <p className="text-blue-200 text-sm">{doctor.subSpecialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Video Consultation Fee</p>
                  <p className="text-xl font-bold">${doctor.videoConsultationFee}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span className="text-sm">{doctor.rating} ({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Waiting Room Content */}
            <div className="p-8">
              {/* Back Button */}
              <button
                onClick={handleBackToProfile}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Profile
              </button>

              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Video className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Video Consultation</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Ready to start your consultation with {doctor.name.split(' ')[1]}?
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Doctor is online & ready</span>
                </div>
              </div>

              {/* Pre-call Checks */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Check Your Setup
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Camera</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Mic className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Microphone</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Speakers</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100">
                <h4 className="font-bold text-gray-800 mb-3">Consultation Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-semibold text-gray-800">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty</span>
                    <span className="font-semibold text-gray-800">{doctor.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Facility</span>
                    <span className="font-semibold text-gray-800">{doctor.facility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold text-gray-800">{doctor.experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Languages</span>
                    <span className="font-semibold text-gray-800">{doctor.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartCall}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Join Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Call Ended View
  if (selectedTab === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Call Ended</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your video consultation with {doctor.name} has ended
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-4">Call Summary</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-800">{formatTime(callDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor</span>
                  <span className="font-semibold text-gray-800">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty</span>
                  <span className="font-semibold text-gray-800">{doctor.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Facility</span>
                  <span className="font-semibold text-gray-800">{doctor.facility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-800">{doctor.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all">
                Download Prescription
              </button>
              <button className="w-full border-2 border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition-all">
                Schedule Follow-up
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-bold transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Call View
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Call Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToProfile}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-12 h-12 rounded-full border-2 border-green-500"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <h3 className="text-white font-bold">{doctor.name}</h3>
              <p className="text-gray-400 text-sm">{doctor.specialty} • {doctor.experience} years exp.</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">{doctor.rating} • {doctor.facility}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-semibold text-sm">{formatTime(callDuration)}</span>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Video Grid */}
        <div className={`flex-1 grid ${showChat ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          {/* Doctor Video */}
          <div className="relative bg-gray-800 rounded-2xl overflow-hidden group">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Doctor Name Overlay */}
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-bold text-lg">{doctor.name}</p>
              <p className="text-sm text-gray-300">{doctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-300">{doctor.rating}</span>
              </div>
            </div>

            {/* Fullscreen Button */}
            <button className="absolute top-4 right-4 w-10 h-10 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Patient Video (Self) */}
          {!showChat && (
            <div className="relative bg-gray-800 rounded-2xl overflow-hidden group">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-16 h-16" />
                  </div>
                  <p className="font-bold text-2xl">You</p>
                </div>
              </div>
              
              {/* Video Off Indicator */}
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <VideoOff className="w-12 h-12" />
                    </div>
                    <p className="text-gray-400">Camera is off</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold">You</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-96 bg-white rounded-2xl shadow-xl flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Chat
                </h3>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${
                    msg.sender === 'patient'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  } rounded-2xl px-4 py-3`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'patient' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          {/* Mic Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              !isVideoOn
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>

          {/* Speaker Toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              !isSpeakerOn
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isSpeakerOn ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              showChat
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>

          {/* Screen Share */}
          <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all">
            <Monitor className="w-6 h-6 text-white" />
          </button>

          {/* Settings */}
          <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all">
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}