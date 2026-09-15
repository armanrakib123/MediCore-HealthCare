import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Pill, Shield, Users, Heart } from 'lucide-react';
import PharmacyCard from '../components/PharmacyCard';
import PrescriptionModal from '../components/PrescriptionModal';
import SuccessToast from '../components/SuccessToast';
import api from '../api/api';
import './Pharmacy.css';

export default function Pharmacy() {
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [submittedTo, setSubmittedTo] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [revealedElements, setRevealedElements] = useState(new Set());

  const fallbackPharmacies = [
    {
      id: 1,
      name: 'Healthguard Pharmacy',
      address: 'Unity Plaza, Colombo 04',
      phone: '+94 11 234 5678',
      rating: 4.8,
      reviews: 324,
      openNow: true,
      hours: 'Open 24/7',
      distance: '0.8 km',
      services: ['24/7 Service', 'Home Delivery', 'Insurance Accepted'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
      location: { lat: 6.8861, lng: 79.8568 }
    },
    {
      id: 2,
      name: 'Union Pharmacy',
      address: 'No 142 Main Street, Colombo 11',
      phone: '+94 11 345 6789',
      rating: 4.6,
      reviews: 189,
      openNow: true,
      hours: '8:00 AM - 10:00 PM',
      distance: '1.2 km',
      services: ['Prescription Refills', 'Consultation Available', 'Online Orders'],
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80',
      location: { lat: 6.9371, lng: 79.8612 }
    },
    {
      id: 3,
      name: 'Asiri Pharmacy',
      address: 'Kirula Road, Colombo 05',
      phone: '+94 11 456 7890',
      rating: 4.9,
      reviews: 412,
      openNow: true,
      hours: '7:00 AM - 11:00 PM',
      distance: '2.1 km',
      services: ['Medical Supplies', 'Health Screening', 'Vaccine Available'],
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80',
      location: { lat: 6.9001, lng: 79.8712 }
    },
    {
      id: 4,
      name: 'Lanka Hospitals Pharmacy',
      address: 'Elvitigala Mawatha, Colombo 05',
      phone: '+94 11 567 8901',
      rating: 4.7,
      reviews: 267,
      openNow: false,
      hours: '8:00 AM - 8:00 PM',
      distance: '2.8 km',
      services: ['Hospital Pharmacy', 'Specialist Medicines', 'Insurance Direct Billing'],
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80',
      location: { lat: 6.9121, lng: 79.8682 }
    }
  ];

  const [pharmacies, setPharmacies] = useState(fallbackPharmacies);

  const normalizePharmacy = (pharmacy, index) => {
    const name = pharmacy?.pharmacyName || pharmacy?.PharmacyName || pharmacy?.name || 'Pharmacy';
    const addressParts = [
      pharmacy?.address || pharmacy?.Address,
      pharmacy?.city || pharmacy?.City,
      pharmacy?.state || pharmacy?.State,
      pharmacy?.zipCode || pharmacy?.ZipCode
    ].filter(Boolean);
    const services = Array.isArray(pharmacy?.services || pharmacy?.Services)
      ? (pharmacy?.services || pharmacy?.Services)
      : (pharmacy?.offersDelivery || pharmacy?.OffersDelivery)
        ? ['Home Delivery']
        : [];

    return {
      id: pharmacy?.id || pharmacy?._id || pharmacy?.Id || pharmacy?.pharmacyId || pharmacy?.PharmacyId || `pharmacy-${index}`,
      name,
      address: addressParts.join(', ') || 'Address not provided',
      phone: pharmacy?.phone || pharmacy?.Phone || 'N/A',
      rating: typeof pharmacy?.rating === 'number' ? pharmacy.rating : 4.5,
      reviews: typeof pharmacy?.reviews === 'number' ? pharmacy.reviews : 0,
      openNow: pharmacy?.isActive ?? pharmacy?.IsActive ?? true,
      hours: pharmacy?.operatingHours || pharmacy?.OperatingHours || ((pharmacy?.isOpen24Hours || pharmacy?.IsOpen24Hours) ? 'Open 24/7' : 'Hours not available'),
      distance: pharmacy?.distance || pharmacy?.Distance || '',
      services,
      image: pharmacy?.profileImageUrl || pharmacy?.ProfileImageUrl || pharmacy?.image || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80',
      location: pharmacy?.location || null
    };
  };

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

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await api.get('/api/pharmacists');
        const list = Array.isArray(response?.data) ? response.data : [];
        if (list.length > 0) {
          setPharmacies(list.map((item, index) => normalizePharmacy(item, index)));
          return;
        }
      } catch (error) {
        console.warn('Pharmacies API failed, trying active list:', error?.message || error);
      }

      try {
        const response = await api.get('/api/pharmacists/active');
        const list = Array.isArray(response?.data) ? response.data : [];
        if (list.length > 0) {
          setPharmacies(list.map((item, index) => normalizePharmacy(item, index)));
          return;
        }
      } catch (error) {
        console.warn('Active pharmacies API failed, using fallback list:', error?.message || error);
      }

      setPharmacies(fallbackPharmacies);
    };

    fetchPharmacies();
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        setIsLocating(false);
        setLocationQuery('Your Current Location');
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter manually.');
        setIsLocating(false);
      }
    );
  };

  const handleUploadPrescription = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowPrescriptionForm(true);
  };

  const handleCallPharmacy = (pharmacy) => {
    window.open(`tel:${pharmacy.phone.replace(/[^+\d]/g, '')}`);
  };

  const handleGetDirections = (pharmacy) => {
    const mapsQuery = encodeURIComponent(pharmacy.address || pharmacy.name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`, '_blank');
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmitPrescription = async ({ pharmacyId, file, notes }) => {
    const pharmacy = pharmacies.find(p => p.id === pharmacyId);
    setShowPrescriptionForm(false);
    setSubmittedTo(pharmacy);

    let imageData = '';
    let imageFileName = '';
    if (file) {
      imageFileName = file.name;
      try {
        const base64 = await fileToBase64(file);
        if (typeof base64 === 'string') {
          const parts = base64.split(',');
          imageData = parts.length > 1 ? parts[1] : base64;
        }
      } catch (error) {
        console.warn('Failed to read prescription file:', error);
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.post('/api/patients/prescriptions/upload', {
          imageData,
          fileName: imageFileName || 'uploaded-prescription',
          pharmacyId,
          pharmacyName: pharmacy?.name || undefined,
          notes: notes || undefined
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response?.data) {
          console.warn('Upload API returned no data');
        }
      } catch (error) {
        console.warn('Upload API failed:', error);
      }
    }

    setTimeout(() => {
      setSubmittedTo(null);
    }, 5000);
  };

  const mapSrc = userLocation
    ? `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&ie=UTF8&output=embed&z=14`
    : `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery || 'pharmacies near Colombo, Sri Lanka')}&ie=UTF8&output=embed`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Success Toast */}
      {submittedTo && (
        <SuccessToast 
          pharmacy={submittedTo} 
          onClose={() => setSubmittedTo(null)} 
          className="success-toast"
        />
      )}

      {/* Hero Section with Enhanced Animations */}
      <div className="relative overflow-hidden hero-bg-animated parallax-container">
        <div className="floating-elements"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-indigo-400/20"></div>
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{
            transform: `translateY(${scrollY * -0.3}px)`,
            animationDelay: '-5s'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-5 py-2 rounded-full mb-6 border border-white/30 animate-bounce-in">
              <Pill className="w-4 h-4 text-white animate-float" />
              <span className="text-sm font-semibold text-white">Find Pharmacies Near You</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              <span className="text-reveal animate-fade-in-up">
                <span>Your Trusted </span>
                <span className="text-cyan-200 animate-float" style={{ animationDelay: '0.5s' }}>Pharmacy</span>
                <br />
                <span style={{ animationDelay: '1s' }}>Finder & Prescription Service</span>
              </span>
            </h1>
            
            <p className="text-xl text-cyan-50 max-w-2xl mx-auto mb-10 animate-fade-in-up animate-stagger-2">
              Search local pharmacies, upload prescriptions, and view options on the map — fast, secure, and convenient.
            </p>

            {/* Search Bar with Enhanced Animations */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-2xl p-3 flex flex-col lg:flex-row gap-3 glass-card animate-scale-in animate-stagger-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-pulse" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Enter city, ZIP code, or address..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all text-gray-800 magnetic-hover"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleUseLocation}
                    disabled={isLocating}
                    className="btn-enhanced px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-200 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 magnetic-hover interactive-element"
                  >
                    <Navigation className="w-5 h-5" />
                    {isLocating ? 'Locating...' : 'Use Location'}
                  </button>
                  <button className="btn-enhanced px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center gap-2 magnetic-hover interactive-element">
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats with Staggered Animations */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: MapPin, label: 'Verified Pharmacies', value: '500+' },
              { icon: Users, label: 'Happy Customers', value: '50K+' },
              { icon: Shield, label: 'Secure Service', value: '100%' },
              { icon: Heart, label: 'Customer Rating', value: '4.9/5' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="glass-card backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 card-3d-hover pharmacy-card-hover gpu-accelerated"
                style={{
                  animationDelay: `${idx * 0.2}s`
                }}
              >
                <stat.icon className="w-8 h-8 text-cyan-200 mx-auto mb-3 animate-float" style={{ animationDelay: `${idx * 0.3}s` }} />
                <p className="text-3xl font-bold text-white mb-1 text-reveal">
                  <span>{stat.value}</span>
                </p>
                <p className="text-sm text-cyan-100 text-reveal">
                  <span style={{ animationDelay: `${0.5 + idx * 0.1}s` }}>{stat.label}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section with Scroll Reveal */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 scroll-reveal">
          <div className="h-[500px] relative">
            <iframe
              title="pharmacies-map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full gpu-accelerated"
              style={{ border: 0 }}
            />
            <div className="absolute top-4 left-4 glass-card rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 animate-bounce-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
              <span className="text-sm font-semibold text-gray-700">
                {pharmacies.filter(p => p.openNow).length} pharmacies open now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacies List with Scroll Reveal */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10 scroll-reveal">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in-left">Available Pharmacies</h2>
            <p className="text-gray-600 animate-fade-in-left animate-stagger-1">Found {pharmacies.length} pharmacies near you</p>
          </div>
          <select className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none bg-white magnetic-hover animate-fade-in-right">
            <option>Sort by Distance</option>
            <option>Sort by Rating</option>
            <option>Open Now</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {pharmacies.map((pharmacy, idx) => (
            <div
              key={pharmacy.id}
              className="scroll-reveal pharmacy-card-hover gpu-accelerated"
              style={{
                animationDelay: `${idx * 0.1}s`
              }}
            >
              <PharmacyCard
                pharmacy={pharmacy}
                onUploadPrescription={handleUploadPrescription}
                onCall={handleCallPharmacy}
                onGetDirections={handleGetDirections}
                className="card-3d-hover magnetic-hover interactive-element"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prescription Upload Modal with Enhanced Animations */}
      <PrescriptionModal
        pharmacy={selectedPharmacy}
        isOpen={showPrescriptionForm}
        onClose={() => setShowPrescriptionForm(false)}
        onSubmit={handleSubmitPrescription}
        className="modal-content"
      />
    </div>
  );
}
