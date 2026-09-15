import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          ✅ TEST PAGE WORKING!
        </h1>
        <p className="text-xl text-green-700">
          React Router and Vite are functioning correctly
        </p>
        <div className="mt-8">
          <a 
            href="/doctor-profile/p1" 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
          >
            Go to Doctor Profile p1
          </a>
        </div>
      </div>
    </div>
  );
}