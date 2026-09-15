import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Stethoscope, Hospital, Clock, Shield, Star, 
  ArrowRight, CheckCircle, Users, Award, TrendingUp,
  Phone, Mail, MapPin, Calendar, Activity, Pill, ChevronRight,
  Sparkles, Zap, Target, Play, Pause, Microscope, Brain, Dna, Eye
} from 'lucide-react';

export default function BeautifulHomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 10000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      text: "MediCore made finding the right doctor so easy! The booking process was seamless and the care was exceptional.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      text: "Outstanding platform! I found a specialist quickly and got the treatment I needed. Highly recommend!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      text: "The best healthcare platform I've used. Professional, reliable, and truly caring about patient needs.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-80px) rotate(-2deg); }
          to { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 0 50px rgba(16, 185, 129, 0.6), 0 0 100px rgba(16, 185, 129, 0.3); }
        }
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes particle-float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(120deg); }
          66% { transform: translateY(-10px) translateX(-5px) rotate(240deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.05) rotate(5deg); }
          70% { transform: scale(0.9) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes magnetic-pull {
          0% { transform: scale(1) translateX(0) translateY(0); }
          50% { transform: scale(1.05) translateX(2px) translateY(-2px); }
          100% { transform: scale(1) translateX(0) translateY(0); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 1.2s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 1.4s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-morph { animation: morph 8s ease-in-out infinite; }
        .animate-particle { animation: particle-float 12s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-magnetic { animation: magnetic-pull 0.3s ease-in-out; }
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .text-typing {
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid #10b981;
          animation: typing 3s steps(30, end), blink 0.75s step-end infinite;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .gradient-text {
          background: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Morphing shapes */}
          <div 
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-morph"
            style={{ 
              transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`,
              filter: 'blur(40px)'
            }}
          />
          <div 
            className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-morph"
            style={{ 
              transform: `translate(${-scrollY * 0.25}px, ${scrollY * 0.3}px)`,
              animationDelay: '2s',
              filter: 'blur(40px)'
            }}
          />
          <div 
            className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-morph"
            style={{ 
              transform: `translate(${scrollY * 0.15}px, ${-scrollY * 0.25}px)`,
              animationDelay: '4s',
              filter: 'blur(40px)'
            }}
          />
          
          {/* Floating Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle bg-gradient-to-r from-emerald-400 to-blue-400 animate-particle"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.5}s`
              }}
            />
          ))}

          {/* Interactive cursor following element */}
          <div 
            className="absolute w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl pointer-events-none transition-all duration-300 ease-out"
            style={{
              left: mousePosition.x - 64,
              top: mousePosition.y - 64,
              transform: `scale(${1 + scrollY * 0.001})`
            }}
          />
          
          {/* Geometric floating shapes */}
          <div className="absolute top-1/4 left-1/6 w-6 h-6 bg-emerald-300 rotate-45 animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/6 w-4 h-4 bg-blue-300 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-purple-300 rotate-12 animate-float opacity-30" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-pink-300 rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slideInLeft">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Trusted Healthcare Platform</span>
            </div>

            <div>
              <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                <span className="block text-gray-900">Welcome to</span>
                <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  MediCore
                </span>
              </h1>
              <p className="text-2xl text-gray-600 font-semibold mb-4">
                Transforming Healthcare Access
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Your trusted partner in health and wellness. Connect with top-rated doctors 
                and pharmacies near you. Experience healthcare that's not just fast and reliable, 
                but truly caring. Your well-being is our priority.
              </p>
            </div>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-3">
              {['24/7 Support', 'Verified Professionals', 'Easy Scheduling'].map((tag, idx) => (
                <span key={idx} className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                  <CheckCircle className="w-4 h-4 inline mr-2 text-emerald-600" />
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/auth')}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 animate-pulse-glow"
              >
                Get Started
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/doctors')}
                className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transform hover:-translate-y-1 transition-all duration-300"
              >
                Find a Doctor
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-8">
              {[
                { number: '50K+', label: 'Patients' },
                { number: '500+', label: 'Doctors' },
                { number: '4.9/5', label: 'Rating' }
              ].map((stat, idx) => (
                <div key={idx}>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fadeInUp">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-blue-400 rounded-3xl transform rotate-6 opacity-20 animate-float" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-500">
              <img 
                src="https://i.postimg.cc/tgvkvJQW/ai-generated-happy-healthcare-team-standing-crossing-arms-isolated-on-transparent-background-png.webp"
                alt="Healthcare professionals"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Trusted by 50,000+ Patients</p>
                    <p className="text-sm text-gray-600">Join our growing community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Us</span>
            </h2>
            <p className="text-xl text-gray-600">Experience healthcare excellence like never before</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-12 h-12" />,
                title: 'Quality Care',
                description: 'Experience healthcare with a personal touch, ensuring your well-being is our top priority.',
                color: 'from-red-500 to-pink-500',
                bgColor: 'from-red-50 to-pink-50'
              },
              {
                icon: <Stethoscope className="w-12 h-12" />,
                title: 'Expert Doctors',
                description: 'Access to a network of qualified healthcare professionals ready to serve you.',
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'from-emerald-50 to-teal-50'
              },
              {
                icon: <Hospital className="w-12 h-12" />,
                title: 'Modern Facilities',
                description: 'State-of-the-art medical facilities equipped with the latest technology.',
                color: 'from-blue-500 to-indigo-500',
                bgColor: 'from-blue-50 to-indigo-50'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-gray-100">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float`} style={{animationDelay: `${idx * 0.5}s`}}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 -z-10`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Users className="w-8 h-8" />, number: '50,000+', label: 'Happy Patients' },
              { icon: <Clock className="w-8 h-8" />, number: '15+', label: 'Years Experience' },
              { icon: <Award className="w-8 h-8" />, number: '500+', label: 'Expert Doctors' },
              { icon: <Shield className="w-8 h-8" />, number: '24/7', label: 'Support Available' }
            ].map((stat, idx) => (
              <div key={idx} className="transform hover:scale-110 transition-all duration-300">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <p className="text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-emerald-100 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Grid */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-200 rounded-full blur-2xl opacity-30 animate-float"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-200 rounded-full blur-2xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-600">Comprehensive healthcare solutions tailored for you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Calendar className="w-6 h-6" />, title: 'Online Booking', color: 'emerald', description: 'Easy appointment scheduling' },
              { icon: <Activity className="w-6 h-6" />, title: 'Health Monitoring', color: 'blue', description: 'Track your wellness journey' },
              { icon: <Pill className="w-6 h-6" />, title: 'Prescription Management', color: 'purple', description: 'Manage medications digitally' },
              { icon: <Phone className="w-6 h-6" />, title: 'Telemedicine', color: 'pink', description: 'Connect with doctors remotely' }
            ].map((service, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 hover:rotate-1 transition-all duration-500 border border-gray-100 cursor-pointer overflow-hidden"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${service.color}-50 to-${service.color}-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Floating icon container */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${service.color}-100 to-${service.color}-200 rounded-2xl flex items-center justify-center mb-4 text-${service.color}-600 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className={`w-2 h-2 bg-${service.color}-500 rounded-full group-hover:scale-150 transition-transform`}></div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Technology Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Advanced <span className="gradient-text">Technology</span>
            </h2>
            <p className="text-xl text-gray-600">Cutting-edge healthcare innovations at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Brain className="w-8 h-8" />, 
                title: 'AI Diagnosis', 
                description: 'Advanced AI algorithms for accurate health assessments',
                gradient: 'from-emerald-500 to-teal-500'
              },
              { 
                icon: <Microscope className="w-8 h-8" />, 
                title: 'Digital Labs', 
                description: 'State-of-the-art digital laboratory services',
                gradient: 'from-blue-500 to-indigo-500'
              },
              { 
                icon: <Eye className="w-8 h-8" />, 
                title: 'Smart Monitoring', 
                description: 'Real-time health monitoring with IoT devices',
                gradient: 'from-purple-500 to-pink-500'
              },
              { 
                icon: <Dna className="w-8 h-8" />, 
                title: 'Genomic Analysis', 
                description: 'Personalized treatment based on genetic profiling',
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((tech, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 border border-gray-100 text-center overflow-hidden"
                style={{animationDelay: `${idx * 0.2}s`}}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative z-10 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${tech.gradient} text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-bounce-in`}>
                  {tech.icon}
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {tech.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {tech.description}
                  </p>
                </div>

                {/* Hover effect particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Patients Say</span>
            </h2>
            <p className="text-xl text-gray-600">Real stories from real people</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-12 shadow-xl border border-gray-100">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentTestimonial ? 'bg-emerald-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full -ml-20 -mt-20 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -mr-20 -mb-20 blur-3xl animate-float" style={{animationDelay: '2s'}} />
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400 animate-float" />
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join us today and experience healthcare the way it should be.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Join Us Today
            <ArrowRight className="inline-block ml-2 w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
}
