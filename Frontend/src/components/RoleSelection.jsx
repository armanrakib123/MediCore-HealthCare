import React from 'react';
import { Stethoscope, Pill, User, Users } from 'lucide-react';

const RoleSelection = ({ onRoleSelect, isLoading }) => {
  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Register as a patient to book appointments and manage your health',
      icon: <User className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Register as a healthcare professional to provide medical services',
      icon: <Stethoscope className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'pharmacist',
      title: 'Pharmacist',
      description: 'Register as a pharmacy to manage medications and prescriptions',
      icon: <Pill className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200 hover:border-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Role</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join MediCore as a patient, doctor, or pharmacist to access our comprehensive healthcare platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => !isLoading && onRoleSelect(role.id)}
              className={`
                relative group cursor-pointer transition-all duration-300 transform hover:-translate-y-2
                ${role.bgColor} ${role.borderColor} border-2 rounded-3xl p-8 shadow-lg hover:shadow-2xl
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`relative z-10 w-20 h-20 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 mb-6 mx-auto`}>
                {role.icon}
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {role.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {role.description}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Already have an account?</span>
            <button
              onClick={() => onRoleSelect('login')}
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;