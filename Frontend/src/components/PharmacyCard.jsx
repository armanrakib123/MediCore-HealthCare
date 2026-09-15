import React from 'react';
import { MapPin, Phone, Clock, Star, Navigation, Upload } from 'lucide-react';

export default function PharmacyCard({ 
  pharmacy, 
  onUploadPrescription, 
  onCall, 
  onGetDirections,
  className = "" 
}) {
  return (
    <div className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 pharmacy-card-hover gpu-accelerated ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={pharmacy.image}
          alt={pharmacy.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          {pharmacy.openNow ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              Open Now
            </span>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Closed
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
            {pharmacy.distance}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors">
              {pharmacy.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-800">{pharmacy.rating}</span>
                <span>({pharmacy.reviews} reviews)</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                {pharmacy.address}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {pharmacy.hours}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {pharmacy.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-5">
          {pharmacy.services.map((service, idx) => (
            <span key={idx} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-lg text-xs font-semibold border border-cyan-100">
              {service}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onUploadPrescription(pharmacy)}
            className="flex-1 btn-enhanced bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-cyan-200 transition-all duration-300 flex items-center justify-center gap-2 magnetic-hover interactive-element"
          >
            <Upload className="w-5 h-5 animate-float" />
            Upload Prescription
          </button>
          <button 
            onClick={() => onCall(pharmacy)}
            className="px-6 py-3 border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 rounded-xl font-bold transition-all magnetic-hover interactive-element"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onGetDirections(pharmacy)}
            className="px-6 py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all magnetic-hover interactive-element"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
