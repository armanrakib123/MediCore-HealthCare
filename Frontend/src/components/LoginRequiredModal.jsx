import React from 'react';
import { X, LogIn, User, Shield, ArrowRight } from 'lucide-react';

export default function LoginRequiredModal({ isOpen, onClose, action = "perform this action", redirectTo = "/login" }) {
  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    // Navigate to login page with return URL
    window.location.href = `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-blue-100">Please sign in to continue</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-700 leading-relaxed">
              You need to be logged in to <span className="font-semibold text-gray-900">{action}</span>.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to access all features and book appointments with our healthcare professionals.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">What you'll get:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Book appointments with doctors</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Secure access to your medical records</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Track your appointments and health</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Sign In Now
            </button>
            
            <button
              onClick={onClose}
              className="w-full border-2 border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>

          {/* Additional Links */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Don't have an account?</p>
            <button 
              onClick={() => {
                onClose();
                window.location.href = `${redirectTo}?mode=register&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create New Account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}