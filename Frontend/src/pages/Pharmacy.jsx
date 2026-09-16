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
  const [sortBy, setSortBy] = useState('distance');

  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  const pharmacyImages = [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80'
  ];

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
        ? ['Home Delivery', 'Prescription Refills']
        : ['Prescription Refills'];

    let hours = 'Open 8:00 AM - 8:00 PM';
    if (pharmacy?.isOpen24Hours || pharmacy?.IsOpen24Hours) {
      hours = 'Open 24/7';
    } else if (Array.isArray(pharmacy?.operatingHours) && pharmacy.operatingHours.length > 0) {
      hours = pharmacy.operatingHours[0];
    } else if (typeof pharmacy?.operatingHours === 'string') {
      hours = pharmacy.operatingHours;
    }

    return {
      id: pharmacy?.id || pharmacy?._id || pharmacy?.Id || pharmacy?.pharmacyId || pharmacy?.PharmacyId || `pharmacy-${index}`,
      name,
      address: addressParts.join(', ') || 'Colombo, Sri Lanka',
      phone: pharmacy?.phone || pharmacy?.Phone || '+94 11 234 5678',
      rating: typeof pharmacy?.rating === 'number' ? pharmacy.rating : Number((4.6 + (index % 4) * 0.1).toFixed(1)),
      reviews: typeof pharmacy?.reviews === 'number' ? pharmacy.reviews : (150 + index * 45),
      openNow: pharmacy?.isActive ?? pharmacy?.IsActive ?? true,
      hours,
      distance: pharmacy?.distance || `${(0.8 + index * 0.6).toFixed(1)} km`,
      services,
      image: pharmacy?.profileImageUrl || pharmacy?.ProfileImageUrl || pharmacy?.image || pharmacyImages[index % pharmacyImages.length],
      location: pharmacy?.location || { lat: 6.9271 + (index * 0.01), lng: 79.8612 + (index * 0.01) }
    };
  };

  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/pharmacists/active');
        const list = Array.isArray(response?.data) ? response.data : [];
        if (list.length > 0) {
          setPharmacies(list.map((item, index) => normalizePharmacy(item, index)));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Active pharmacies API failed, checking /api/pharmacists:', error?.message || error);
      }

      try {
        const response = await api.get('/api/pharmacists');
        const list = Array.isArray(response?.data) ? response.data : [];
        if (list.length > 0) {
          setPharmacies(list.map((item, index) => normalizePharmacy(item, index)));
        }
      } catch (error) {
        console.error('Failed to fetch pharmacies from MongoDB:', error);
      } finally {
        setLoading(false);
      }
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

    const token = localStorage.getItem('token');
    if (token && file) {
      try {
        const base64 = await fileToBase64(file);
        await api.post('/api/patients/prescriptions/upload', {
          pharmacyId,
          notes,
          fileName: file.name,
          imageData: base64
        });
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

  const filteredPharmacies = pharmacies
    .filter(p => {
      if (!locationQuery.trim() || locationQuery === 'Your Current Location') return true;
      const q = locationQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'open') return (b.openNow ? 1 : 0) - (a.openNow ? 1 : 0);
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

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
              Search local pharmacies, upload prescriptions, and view live options on the map — fast, secure, and convenient.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-2xl p-3 flex flex-col lg:flex-row gap-3 glass-card animate-scale-in animate-stagger-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-pulse" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Search by pharmacy name, city, or address..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all text-gray-800"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleUseLocation}
                    disabled={isLocating}
                    className="btn-enhanced px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-200 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Navigation className="w-5 h-5" />
                    {isLocating ? 'Locating...' : 'Use Location'}
                  </button>
                  {locationQuery && (
                    <button 
                      onClick={() => setLocationQuery('')}
                      className="px-4 py-4 bg-white/50 text-gray-700 hover:bg-white rounded-xl font-semibold text-sm transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: MapPin, label: 'Verified Pharmacies', value: `${pharmacies.length || 5}+` },
              { icon: Users, label: 'Happy Customers', value: '50K+' },
              { icon: Shield, label: 'Secure Service', value: '100%' },
              { icon: Heart, label: 'Customer Rating', value: '4.9/5' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="glass-card backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 card-3d-hover pharmacy-card-hover gpu-accelerated"
              >
                <stat.icon className="w-8 h-8 text-cyan-200 mx-auto mb-3 animate-float" />
                <p className="text-3xl font-bold text-white mb-1">
                  <span>{stat.value}</span>
                </p>
                <p className="text-sm text-cyan-100">
                  <span>{stat.label}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="h-[450px] relative">
            <iframe
              title="pharmacies-map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full gpu-accelerated"
              style={{ border: 0 }}
            />
            <div className="absolute top-4 left-4 glass-card rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 animate-bounce-in bg-white/90">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
              <span className="text-sm font-semibold text-gray-700">
                {pharmacies.filter(p => p.openNow).length} pharmacies open now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacies List */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Pharmacies</h2>
            <p className="text-gray-600">
              {loading ? 'Loading pharmacies from database...' : `Found ${filteredPharmacies.length} pharmacies from MongoDB database`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none bg-white transition-all text-sm"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="open">Open Now</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-bold text-gray-800">Loading Pharmacies</p>
            <p className="text-gray-500 mt-1">Connecting to MongoDB database...</p>
          </div>
        ) : filteredPharmacies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Pill className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-70" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Pharmacies Found</h3>
            <p className="text-gray-500 mb-6">No pharmacy matched your search criteria. Try a different term or clear the filter.</p>
            <button
              onClick={() => setLocationQuery('')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-md"
            >
              View All Pharmacies
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="pharmacy-card-hover gpu-accelerated"
              >
                <PharmacyCard
                  pharmacy={pharmacy}
                  onUploadPrescription={handleUploadPrescription}
                  onCall={handleCallPharmacy}
                  onGetDirections={handleGetDirections}
                  className="card-3d-hover interactive-element"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Upload Modal */}
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
