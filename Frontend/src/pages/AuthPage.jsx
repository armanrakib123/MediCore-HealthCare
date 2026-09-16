import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleSelection from '../components/RoleSelection';
import RegistrationForm from '../components/RegistrationForm';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  // Default to login mode so users can sign in immediately
  const initialMode = searchParams.get('mode') === 'register' ? 'role-selection' : 'login';
  const [currentStep, setCurrentStep] = useState(initialMode); // role-selection, registration, login
  const [selectedRole, setSelectedRole] = useState(null);

  // If already authenticated, redirect to appropriate role dashboard automatically
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        const role = (parsed.role || '').toLowerCase();
        if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else if (role === 'pharmacist') {
          navigate('/pharmacy-dashboard');
        } else if (role === 'admin' || role === 'super_admin' || role === 'doctor_admin') {
          navigate('/admin-dashboard');
        } else if (role === 'patient' || role === 'user') {
          navigate('/patient-dashboard');
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }, [navigate]);

  const routeByRole = (roleName) => {
    const role = (roleName || '').toLowerCase();
    if (role === 'doctor') {
      navigate('/doctor-dashboard');
    } else if (role === 'pharmacist') {
      navigate('/pharmacy-dashboard');
    } else if (role === 'admin' || role === 'super_admin' || role === 'doctor_admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
  };

  const handleRoleSelect = (role) => {
    if (role === 'login') {
      setCurrentStep('login');
    } else {
      setSelectedRole(role);
      setCurrentStep('registration');
    }
  };

  const handleRegistrationSuccess = (data) => {
    console.log('Registration successful:', data);
    if (data.response) {
      const { token, username, role, avatarColor, avatarEmoji, profileImageUrl } = data.response;
      const user = {
        username,
        role,
        avatarColor,
        avatarEmoji,
        profileImageUrl,
        ...(data.response.doctorId && { doctorId: data.response.doctorId }),
        ...(data.response.pharmacyId && { pharmacyId: data.response.pharmacyId }),
        ...(data.response.patientId && { patientId: data.response.patientId })
      };
      login(user, token);
      routeByRole(role);
    } else {
      alert(`Registration successful as ${data.role}! Please log in.`);
      setCurrentStep('login');
    }
  };

  const handleLoginSuccess = (data) => {
    console.log('Login successful:', data);
    const resp = data.response || {};
    const token = resp.token || data.token;
    const username = resp.username || data.username;
    const role = resp.role || data.role || 'Doctor';
    const avatarColor = resp.avatarColor;
    const avatarEmoji = resp.avatarEmoji;
    const profileImageUrl = resp.profileImageUrl;

    const user = {
      username,
      role,
      avatarColor,
      avatarEmoji,
      profileImageUrl,
      ...(resp.doctorId && { doctorId: resp.doctorId }),
      ...(resp.pharmacyId && { pharmacyId: resp.pharmacyId }),
      ...(resp.patientId && { patientId: resp.patientId })
    };

    login(user, token);
    routeByRole(role);
  };

  const handleBack = () => {
    if (currentStep === 'registration') {
      setCurrentStep('role-selection');
      setSelectedRole(null);
    } else if (currentStep === 'login') {
      setCurrentStep('role-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      {/* Quick Navigation Toggle between Sign In and Register */}
      <div className="max-w-md mx-auto mb-6 px-4">
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentStep('login')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              currentStep === 'login'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentStep('role-selection');
              setSelectedRole(null);
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              currentStep === 'role-selection' || currentStep === 'registration'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {currentStep === 'role-selection' && (
        <RoleSelection onRoleSelect={handleRoleSelect} isLoading={false} />
      )}

      {currentStep === 'registration' && (
        <RegistrationForm
          role={selectedRole}
          onBack={handleBack}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {currentStep === 'login' && (
        <LoginForm
          onBack={handleBack}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default AuthPage;