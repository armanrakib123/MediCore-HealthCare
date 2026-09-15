import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessToast({ pharmacy, onClose, duration = 5000, className = "" }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!pharmacy) return null;

  return (
    <div className={`fixed top-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-green-100 p-6 max-w-md animate-slide-in ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 mb-1">Prescription Submitted!</h4>
          <p className="text-sm text-gray-600">
            Your prescription has been sent to <span className="font-semibold text-gray-800">{pharmacy.name}</span>. 
            They will contact you shortly.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{pharmacy.address}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span>📞</span>
              <span>{pharmacy.phone}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}