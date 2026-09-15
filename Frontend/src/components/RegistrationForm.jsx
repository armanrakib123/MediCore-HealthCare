import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, Phone, Calendar, MapPin, Building, FileText, Stethoscope, Pill } from 'lucide-react';
import { register, registerDoctor, registerPharmacist, registerPatient } from '../api/api';

const RegistrationForm = ({ role, onBack, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [googleReady, setGoogleReady] = useState(false);
  const googleFallbackRef = useRef(null);

  const roleConfig = {
    patient: {
      title: 'Register as Patient',
      description: 'Join our patient community to access healthcare services',
      icon: <User className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      fields: [
        { name: 'username', label: 'Username', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'email', label: 'Email', type: 'email', required: true, icon: <Mail className="w-5 h-5" /> },
        { name: 'password', label: 'Password', type: 'password', required: true, icon: <Lock className="w-5 h-5" /> },
        { name: 'firstName', label: 'First Name', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true, icon: <Phone className="w-5 h-5" /> },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, icon: <Calendar className="w-5 h-5" /> },
        { name: 'bloodType', label: 'Blood Type', type: 'select', required: true, icon: <FileText className="w-5 h-5" />, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        { name: 'address', label: 'Address', type: 'text', required: true, icon: <MapPin className="w-5 h-5" /> }
      ]
    },
    doctor: {
      title: 'Register as Doctor',
      description: 'Join our network of healthcare professionals',
      icon: <Stethoscope className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      fields: [
        { name: 'username', label: 'Username', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'email', label: 'Email', type: 'email', required: true, icon: <Mail className="w-5 h-5" /> },
        { name: 'password', label: 'Password', type: 'password', required: true, icon: <Lock className="w-5 h-5" /> },
        { name: 'firstName', label: 'First Name', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true, icon: <Phone className="w-5 h-5" /> },
        { name: 'licenseNumber', label: 'Medical License Number', type: 'text', required: true, icon: <FileText className="w-5 h-5" /> },
        { name: 'specialization', label: 'Specialization', type: 'select', required: true, icon: <Stethoscope className="w-5 h-5" />, options: ['General Practice', 'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery', 'Urology'] },
        { name: 'medicalSchool', label: 'Medical School', type: 'text', required: true, icon: <Building className="w-5 h-5" /> },
        { name: 'yearsOfExperience', label: 'Years of Experience', type: 'number', required: true, icon: <Calendar className="w-5 h-5" /> },
        { name: 'biography', label: 'Biography', type: 'textarea', required: false, icon: <FileText className="w-5 h-5" /> }
      ]
    },
    pharmacist: {
      title: 'Register as Pharmacist',
      description: 'Join our pharmacy network to serve patients',
      icon: <Pill className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      fields: [
        { name: 'username', label: 'Username', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'email', label: 'Email', type: 'email', required: true, icon: <Mail className="w-5 h-5" /> },
        { name: 'password', label: 'Password', type: 'password', required: true, icon: <Lock className="w-5 h-5" /> },
        { name: 'firstName', label: 'First Name', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, icon: <User className="w-5 h-5" /> },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true, icon: <Phone className="w-5 h-5" /> },
        { name: 'pharmacyName', label: 'Pharmacy Name', type: 'text', required: true, icon: <Building className="w-5 h-5" /> },
        { name: 'licenseNumber', label: 'Pharmacy License Number', type: 'text', required: true, icon: <FileText className="w-5 h-5" /> },
        { name: 'address', label: 'Address', type: 'text', required: true, icon: <MapPin className="w-5 h-5" /> },
        { name: 'city', label: 'City', type: 'text', required: true, icon: <MapPin className="w-5 h-5" /> },
        { name: 'state', label: 'State', type: 'text', required: true, icon: <MapPin className="w-5 h-5" /> },
        { name: 'zipCode', label: 'Zip Code', type: 'text', required: true, icon: <MapPin className="w-5 h-5" /> }
      ]
    }
  };

  const config = roleConfig[role];

  const decodeJwtPayload = (token) => {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const renderGoogleFallbackButton = () => {
      if (!googleFallbackRef.current || !window.google?.accounts?.id) return;

      googleFallbackRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleFallbackRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 260
      });
    };

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: '576024480859-t60g54pu3i72q7s01gn91qorccp0v2cf.apps.googleusercontent.com',
        callback: (response) => {
          if (!response?.credential) return;
          const payload = decodeJwtPayload(response.credential) || {};
          const nameParts = (payload.name || '').trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ');
          const email = payload.email || '';
          const usernameFromEmail = email ? email.split('@')[0] : '';

          setFormData((prev) => ({
            ...prev,
            email: email || prev.email,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            username: prev.username || usernameFromEmail
          }));
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: true
      });
      setGoogleReady(true);
      renderGoogleFallbackButton();
    };

    if (existingScript) {
      initGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);

    return () => {
      setGoogleReady(false);
    };
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    config.fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      
      // Map role to API endpoint and prepare data
      switch (role) {
        case 'patient':
          response = await registerPatient({
            Username: formData.username,
            Email: formData.email,
            Password: formData.password,
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Phone: formData.phone,
            DateOfBirth: formData.dateOfBirth,
            BloodType: formData.bloodType,
            Address: formData.address
          });
          break;
          
        case 'doctor':
          response = await registerDoctor({
            Username: formData.username,
            Email: formData.email,
            Password: formData.password,
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Phone: formData.phone,
            DateOfBirth: '1990-01-01', // Default date, should be from form
            LicenseNumber: formData.licenseNumber,
            Specialization: formData.specialization,
            MedicalSchool: formData.medicalSchool,
            YearsOfExperience: parseInt(formData.yearsOfExperience),
            Certifications: [],
            Languages: ['English'],
            ConsultationFee: 100.00,
            Biography: formData.biography || null
          });
          break;
          
        case 'pharmacist':
          response = await registerPharmacist({
            Username: formData.username,
            Email: formData.email,
            Password: formData.password,
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Phone: formData.phone,
            PharmacyName: formData.pharmacyName,
            LicenseNumber: formData.licenseNumber,
            Address: formData.address,
            City: formData.city,
            State: formData.state,
            ZipCode: formData.zipCode
          });
          break;
          
        default:
          throw new Error('Invalid role specified');
      }
      
      onSuccess({
        role,
        data: formData,
        response: response.data
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    
    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      
      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`w-full px-4 py-3 pl-12 pr-12 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors[field.name] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        );
      
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Role Selection
          </button>
          
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl text-white shadow-lg mb-4`}>
            {config.icon}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
          <p className="text-gray-600">{config.description}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick sign up</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <div className="mt-5 flex flex-col items-center gap-3">
              <div ref={googleFallbackRef} className={googleReady ? 'block' : 'hidden'} />
              <p className="text-center text-xs text-gray-500 max-w-sm">We only prefill your name and email. Complete the remaining details to finish registration.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {config.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {field.icon}
                    </div>
                    {renderField(field)}
                  </div>
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r ${config.color} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;