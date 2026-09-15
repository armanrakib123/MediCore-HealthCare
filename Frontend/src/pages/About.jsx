import React, { useState, useEffect } from 'react';
import { Target, HandHeart, Users, Heart, Award, Globe, ArrowRight, Sparkles, Zap, Eye, Shield, Microscope } from 'lucide-react';

export default function About() {
  const [scrollY, setScrollY] = useState(0);
  const [revealedElements, setRevealedElements] = useState(new Set());

  // Scroll event listener for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Reveal elements on scroll
      const elements = document.querySelectorAll('.scroll-reveal');
      const revealed = new Set(revealedElements);
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('revealed');
          revealed.add(element);
        }
      });
      
      setRevealedElements(revealed);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [revealedElements]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-violet-50">
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
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 1.2s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 1.4s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-magnetic { animation: magnetic-pull 0.3s ease-in-out; }
        .animate-morph { animation: morph 8s ease-in-out infinite; }
        .gradient-text {
          background: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
      {/* Hero Section with Enhanced Animations */}
      <header className="relative overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{
              transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`,
            }}
          ></div>
          <div 
            className="absolute top-40 right-10 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{
              transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.4}px)`,
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{
              transform: `translate(${scrollY * 0.1}px, ${-scrollY * 0.3}px)`,
              animationDelay: '2s'
            }}
          ></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-300 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-violet-300 rotate-45 animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full border border-emerald-200 animate-bounce-in">
                <Heart className="w-4 h-4 text-emerald-600 animate-float" />
                <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">About Us</span>
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-reveal">
                  <span className="gradient-text animate-bounce-in">
                    MediCore
                  </span>
                </span>
              </h1>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-600 leading-relaxed text-reveal animate-fade-in-up animate-stagger-1">
                  <span>MediCore connects patients with trusted doctors and pharmacies, making healthcare more accessible and reliable for everyone. Our platform leverages advanced technology to simplify appointment booking, prescription management, and provider discovery.</span>
                </p>

                <p className="text-base text-gray-500 leading-relaxed text-reveal animate-fade-in-up animate-stagger-2">
                  <span>We believe in combining modern digital tools with compassionate, personalized care—ensuring every patient receives attention tailored to their unique needs. Whether you need a specialist, a nearby pharmacy, or support navigating your health journey, MediCore is here to guide you every step of the way.</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="group btn-enhanced px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 magnetic-hover interactive-element">
                  Find a Doctor
                  <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform w-5 h-5" />
                </button>
                <button className="btn-enhanced px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transform hover:-translate-y-1 transition-all duration-300 magnetic-hover interactive-element">
                  Find a Pharmacy
                </button>
              </div>
            </div>

            <div className="relative lg:h-[500px] z-10 scroll-reveal">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-violet-400 rounded-3xl transform rotate-6 opacity-20 animate-float animate-morph"></div>
              <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-500 card-3d-hover gpu-accelerated">
                <img 
                  src="https://i.pinimg.com/1200x/fe/57/9f/fe579ffd25276e47e61f5f9c0ffbffd4.jpg"
                  alt="Medical professionals team"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
                
                {/* Enhanced floating badge */}
                <div className="absolute top-4 right-4 glass-effect rounded-full px-4 py-2 animate-bounce-in">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">Trusted Platform</span>
                  </div>
                </div>

                {/* Additional floating elements */}
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-blue-400/30 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-1/3 right-8 w-8 h-8 bg-violet-400/40 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Stats Section */}
      <section className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Happy Patients', icon: '👥' },
              { number: '500+', label: 'Verified Doctors', icon: '👨‍⚕️' },
              { number: '100+', label: 'Partner Pharmacies', icon: '🏥' },
              { number: '4.9/5', label: 'Average Rating', icon: '⭐' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center transform hover:scale-110 transition-transform duration-300 scroll-reveal pharmacy-card-hover gpu-accelerated"
                style={{
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent mb-2 text-reveal">
                  <span>{stat.number}</span>
                </div>
                <div className="text-2xl mb-2 animate-float" style={{ animationDelay: `${idx * 0.2}s` }}>
                  {stat.icon}
                </div>
                <div className="text-gray-600 font-medium text-reveal">
                  <span style={{ animationDelay: `${0.5 + idx * 0.1}s` }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-stagger-1">
              <span>We aim to bridge the gap between patients and quality healthcare by providing a simple, reliable platform to discover providers and services nearby.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-10 h-10" />,
                title: 'Focused Care',
                description: 'Personalized resources that put patient needs first.',
                color: 'from-emerald-500 to-teal-500',
                delay: '0s'
              },
              {
                icon: <HandHeart className="w-10 h-10" />,
                title: 'Trusted Network',
                description: 'Verified professionals and pharmacy partners you can rely on.',
                color: 'from-blue-500 to-indigo-500',
                delay: '0.2s'
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Community First',
                description: 'We support local providers and strive to improve access for all.',
                color: 'from-violet-500 to-purple-500',
                delay: '0.4s'
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 scroll-reveal pharmacy-card-hover gpu-accelerated"
                style={{
                  animationDelay: card.delay
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
                <div className={`inline-flex p-4 bg-gradient-to-br ${card.color} text-white rounded-xl mb-6 shadow-lg animate-float`} style={{ animationDelay: `${idx * 0.3}s` }}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
                
                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent">Core Values</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Heart className="w-8 h-8" />, 
                title: 'Compassion', 
                description: 'We care deeply about every patient\'s well-being',
                delay: '0s'
              },
              { 
                icon: <Award className="w-8 h-8" />, 
                title: 'Excellence', 
                description: 'Committed to the highest standards of healthcare',
                delay: '0.2s'
              },
              { 
                icon: <Globe className="w-8 h-8" />, 
                title: 'Accessibility', 
                description: 'Making quality healthcare available to everyone',
                delay: '0.4s'
              }
            ].map((value, idx) => (
              <div 
                key={idx} 
                className="text-center p-8 rounded-xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-violet-50 transition-all duration-300 scroll-reveal magnetic-hover interactive-element"
                style={{
                  animationDelay: value.delay
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-violet-500 text-white rounded-full mb-4 shadow-lg animate-bounce-in">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Technology & Innovation Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Innovation in <span className="text-yellow-300">Healthcare</span>
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Leveraging cutting-edge technology to transform patient care and improve health outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Microscope className="w-10 h-10" />, 
                title: 'Advanced Diagnostics', 
                description: 'State-of-the-art diagnostic tools for accurate health assessments',
                delay: '0s'
              },
              { 
                icon: <Eye className="w-10 h-10" />, 
                title: 'AI-Powered Insights', 
                description: 'Machine learning algorithms for personalized health recommendations',
                delay: '0.2s'
              },
              { 
                icon: <Shield className="w-10 h-10" />, 
                title: 'Data Security', 
                description: 'Enterprise-grade security protecting your health information',
                delay: '0.4s'
              },
              { 
                icon: <Zap className="w-10 h-10" />, 
                title: 'Real-time Monitoring', 
                description: 'Continuous health monitoring with instant alerts and notifications',
                delay: '0.6s'
              }
            ].map((innovation, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transform hover:-translate-y-3 transition-all duration-500"
                style={{animationDelay: innovation.delay}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 text-yellow-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {innovation.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-200 transition-colors">
                    {innovation.title}
                  </h3>
                  <p className="text-emerald-100 leading-relaxed group-hover:text-white transition-colors">
                    {innovation.description}
                  </p>
                </div>

                {/* Floating particles effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" style={{animationDelay: '0.5s'}}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Meet Our <span className="bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animate-stagger-1">
              <span>A passionate team working to improve healthcare access</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: 'Dr. Aisha Khan',
                role: 'Clinical Advisor',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80',
                gradient: 'from-emerald-500 to-teal-500',
                delay: '0s'
              },
              {
                name: 'Samuel Green',
                role: 'Product Lead',
                image: 'https://images.unsplash.com/photo-1600878459138-e1123b37cb30?auto=format&fit=crop&q=80',
                gradient: 'from-blue-500 to-indigo-500',
                delay: '0.2s'
              },
              {
                name: 'Lina Patel',
                role: 'Community Manager',
                image: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80',
                gradient: 'from-violet-500 to-purple-500',
                delay: '0.4s'
              }
            ].map((member, idx) => (
              <div 
                key={idx} 
                className="group relative scroll-reveal pharmacy-card-hover gpu-accelerated"
                style={{
                  animationDelay: member.delay
                }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 card-3d-hover">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                      {member.role}
                    </p>
                  </div>
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${member.gradient}`}></div>
                  
                  {/* Floating social icons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs">💼</span>
                      </div>
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs">📧</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-6 scroll-reveal">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-violet-600 p-12 lg:p-16 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-violet-400/20"></div>
            <div 
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-float"
              style={{ animationDelay: '1s' }}
            ></div>
            <div 
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-float"
              style={{ animationDelay: '2s' }}
            ></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white/25 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="relative text-center text-white space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-reveal">
                <span className="animate-fade-in-up">Ready to find the right care?</span>
              </h2>
              <p className="text-xl text-emerald-50 max-w-2xl mx-auto text-reveal animate-fade-in-up animate-stagger-1">
                <span>Search for doctors, explore facilities, or contact us for help.</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <button className="btn-enhanced px-10 py-4 bg-white text-emerald-600 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 magnetic-hover interactive-element">
                  Find a Doctor
                </button>
                <button className="btn-enhanced px-10 py-4 bg-transparent text-white rounded-xl font-bold border-2 border-white hover:bg-white hover:text-emerald-600 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 magnetic-hover interactive-element">
                  Find a Pharmacy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
