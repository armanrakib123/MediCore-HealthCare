import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '../components/RoleSelection';
import RegistrationForm from '../components/RegistrationForm';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState('role-selection'); // role-selection, registration, login
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    if (role === 'login') {
      setCurrentStep('login');
    } else {
      setSelectedRole(role);
      setCurrentStep('registration');
    }
  };

  const handleRegistrationSuccess = (data) => {
    // Handle successful registration
    console.log('Registration successful:', data);
    
    // Automatically login the user with the response data
    if (data.response) {
      const { token, username, role, avatarColor, avatarEmoji, profileImageUrl } = data.response;
      
      // Create user object from response
      const user = {
        username,
        role,
        avatarColor,
        avatarEmoji,
        profileImageUrl,
        // Add role-specific data if available
        ...(data.response.doctorId && { doctorId: data.response.doctorId }),
        ...(data.response.pharmacyId && { pharmacyId: data.response.pharmacyId }),
        ...(data.response.patientId && { patientId: data.response.patientId })
      };
      
      // Login the user
      login(user, token);
      
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'Patient':
          navigate('/patient-dashboard');
          break;
        case 'Doctor':
          navigate('/doctor-dashboard');
          break;
        case 'Pharmacist':
          navigate('/pharmacy-dashboard');
          break;
        default:
          // Fallback for unknown roles
          navigate('/');
          break;
      }
    } else {
      // Fallback if no response data
      alert(`Registration successful as ${data.role}! Please log in.`);
      setCurrentStep('login');
    }
  };

  const handleLoginSuccess = (data) => {
    // Handle successful login
    console.log('Login successful:', data);
    
    // If we have response data from LoginForm, use it for redirection
    if (data.response) {
      const { token, username, role, avatarColor, avatarEmoji, profileImageUrl } = data.response;
      
      // Create user object from response
      const user = {
        username,
        role,
        avatarColor,
        avatarEmoji,
        profileImageUrl,
        // Add role-specific data if available
        ...(data.response.doctorId && { doctorId: data.response.doctorId }),
        ...(data.response.pharmacyId && { pharmacyId: data.response.pharmacyId }),
        ...(data.response.patientId && { patientId: data.response.patientId })
      };
      
      // Login the user (this is handled by LoginForm now, but we can ensure consistency)
      login(user, token);
      
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'Patient':
          navigate('/patient-dashboard');
          break;
        case 'Doctor':
          navigate('/doctor-dashboard');
          break;
        case 'Pharmacist':
          navigate('/pharmacy-dashboard');
          break;
        default:
          // Fallback for unknown roles
          navigate('/');
          break;
      }
    } else {
      // Fallback if no response data
      alert('Login successful! Redirecting to dashboard...');
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep === 'registration') {
      setCurrentStep('role-selection');
      setSelectedRole(null);
    } else if (currentStep === 'login') {
      setCurrentStep('role-selection');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'role-selection':
        return (
          <RoleSelection
            onRoleSelect={handleRoleSelect}
            isLoading={false}
          />
        );
      
      case 'registration':
        return (
          <RegistrationForm
            role={selectedRole}
            onBack={handleBack}
            onSuccess={handleRegistrationSuccess}
          />
        );
      
      case 'login':
        return (
          <LoginForm
            onBack={handleBack}
            onSuccess={handleLoginSuccess}
          />
        );
      
      default:
        return (
          <RoleSelection
            onRoleSelect={handleRoleSelect}
            isLoading={false}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
    </div>
  );
};

export default AuthPage;