import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Login.css';
import { Heart, Mail, Lock, User, Phone, Calendar, Building2, Award, AlertCircle, Loader2 } from 'lucide-react';
import { login as apiLogin, register as apiRegister } from '../api/api'
import PasswordResetModal from '../components/PasswordResetModal'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentPage, setCurrentPage] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    dob: '',
    role: 'Patient',
    // Professional fields
    businessName: '',
    businessLicense: '',
    medicalLicense: '',
    specialization: '',
    experience: '',
    address: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

  // Role-based dashboard redirect helper function
  const getDashboardLink = (userRole) => {
    switch (userRole) {
      case 'Doctor':
        return '/doctor-dashboard'
      case 'Pharmacist':
        return '/pharmacy-dashboard'
      case 'Admin':
      case 'super_admin':
      case 'doctor_admin':
        return '/admin-dashboard'
      case 'Patient':
      case 'User':
      default:
        return '/patient-dashboard'
    }
  }

  const handleLogin = async () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      setErrorMessage('Please enter email and password');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const resp = await apiLogin({ usernameOrEmail: formData.email, password: formData.password })
      const data = resp.data
      const token = data.token || data.Token
      const username = data.username || data.Username
      const role = data.role || data.Role
      const avatarColor = data.avatarColor
      const avatarEmoji = data.avatarEmoji
      const profileImageUrl = data.profileImageUrl
      
      if (!token) throw new Error('No token returned from server')
      
      // Store complete user data including avatar
      const userData = { 
        username, 
        role, 
        avatarColor, 
        avatarEmoji, 
        profileImageUrl: profileImageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        email: formData.email
      }
      
      // Use the auth hook to login (this will update the Header automatically)
      login(userData, token);
      
      // Redirect to appropriate dashboard based on role
      navigate(getDashboardLink(role));
    } catch (err) {
      console.error(err)
      // Handle network errors specifically
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setErrorMessage('Unable to connect to server. Please check if the backend is running on http://localhost:5000');
      } else if (err?.response?.status === 401) {
        setErrorMessage('Invalid email or password. Please try again.');
      } else if (err?.response?.status === 404) {
        setErrorMessage('User not found. Please register first.');
      } else {
        setErrorMessage(err?.response?.data || err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Map frontend role to backend role for registration
      let backendRole = formData.role;
      if (formData.role === 'Pharmacy') {
        backendRole = 'Pharmacist';
      }
      
      // Only send fields that the backend expects
      const payload = {
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: backendRole,
        phone: formData.phone,
        dateOfBirth: formData.dob ? new Date(formData.dob).toISOString() : null
        // Note: Professional fields (businessName, businessLicense, etc.) are not sent to backend
        // This will be handled separately in a future implementation
      }
      
      const resp = await apiRegister(payload)
      const data = resp.data
      const token = data.token || data.Token
      const username = data.username || data.Username
      const role = data.role || data.Role
      const avatarColor = data.avatarColor
      const avatarEmoji = data.avatarEmoji
      const profileImageUrl = data.profileImageUrl
      
      if (!token) throw new Error('No token returned from server')
      
      // Store complete user data including avatar
      const userData = {
        username,
        role,
        avatarColor,
        avatarEmoji,
        profileImageUrl: profileImageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        email: formData.email
      }
      
      // Use the auth hook to login (this will update the Header automatically)
      login(userData, token);
      
      // Redirect to appropriate dashboard based on role
      navigate(getDashboardLink(role));
    } catch (err) {
      console.error(err)
      // Handle network errors specifically
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setErrorMessage('Unable to connect to server. Please check if the backend is running on http://localhost:5000');
      } else if (err?.response?.status === 409) {
        setErrorMessage('Email already registered. Please login instead.');
      } else {
        setErrorMessage(err?.response?.data || err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render role-specific fields
  const renderRoleSpecificFields = () => {
    if (formData.role === 'User') {
      // Patient fields
      return (
        <>
          <div>
            <label className="label">Date of Birth</label>
            <div className="input-group">
              <Calendar className="icon-left" />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="form-input date-input"
                min="1900-01-01"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </>
      );
    } else if (formData.role === 'Pharmacist') {
      // Pharmacy fields
      return (
        <>
          <div>
            <label className="label">Business Name</label>
            <div className="input-group">
              <Building2 className="icon-left" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="MedCare Pharmacy"
              />
            </div>
          </div>

          <div>
            <label className="label">Business License Number</label>
            <div className="input-group">
              <Award className="icon-left" />
              <input
                type="text"
                name="businessLicense"
                value={formData.businessLicense}
                onChange={handleInputChange}
                className="form-input"
                placeholder="BL123456789"
              />
            </div>
          </div>

          <div>
            <label className="label">Business Address</label>
            <div className="input-group">
              <User className="icon-left" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                placeholder="123 Main Street, City, State"
              />
            </div>
          </div>
        </>
      );
    } else if (formData.role === 'Doctor') {
      // Doctor fields
      return (
        <>
          <div>
            <label className="label">Medical License Number</label>
            <div className="input-group">
              <Award className="icon-left" />
              <input
                type="text"
                name="medicalLicense"
                value={formData.medicalLicense}
                onChange={handleInputChange}
                className="form-input"
                placeholder="MD123456789"
              />
            </div>
          </div>

          <div>
            <label className="label">Specialization</label>
            <div className="input-group">
              <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="form-input">
                <option value="">Select Specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Oncology">Oncology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery">Surgery</option>
                <option value="Urology">Urology</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Years of Experience</label>
            <div className="input-group">
              <Award className="icon-left" />
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="form-input"
                placeholder="5"
                min="0"
                max="50"
              />
            </div>
          </div>
        </>
      );
    }
  };

  return (
  <div className="login-page">

      {/* Background image + decorative blobs (image optional: place file at public/background-medical.jpg) */}
      <div className="bg-decor">
        <img src="/background-medical.jpg" alt="bg" className="bg-image animate-pan" />
        <div className="blob-1 animate-blob"></div>
        <div className="blob-2 animate-blob delay-2s"></div>
      </div>

      <div className="container">
        {/* Heartbeat Animation Header */}
        <div className="header fade-in">
          <div className="logo-wrapper">
            <span className="logo-pulse-1 pulse-ring"></span>
            <span className="logo-pulse-2 pulse-ring" style={{animationDelay: '1s'}}></span>
            <div className="logo heartbeat">
              <Heart className="icon" />
            </div>
          </div>
          <h1 className="title">MediCore</h1>
          <p className="subtitle">Your health, our priority</p>
        </div>

    {/* Auth Card */}
  <div className="auth-card fade-in">
            {/* Toggle Buttons */}
            <div className="toggle-buttons">
              <button
                onClick={() => { setCurrentPage('login'); setErrorMessage(''); }}
                className={`toggle-btn ${currentPage === 'login' ? 'active' : ''}`}
              >
                Login
              </button>
              <button
                onClick={() => { setCurrentPage('register'); setErrorMessage(''); }}
                className={`toggle-btn ${currentPage === 'register' ? 'active' : ''}`}
              >
                Register
              </button>
            </div>

          {/* Login Form */}
          {currentPage === 'login' && (
            <div className="form-block fade-in">
              {/* Error Message Display */}
              {errorMessage && (
                <div className="error-message" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  color: '#dc2626'
                }}>
                  <AlertCircle size={20} />
                  <span style={{ fontSize: '14px' }}>{errorMessage}</span>
                </div>
              )}
              
              <div>
                <label className="label">Email Address</label>
                <div className="input-group">
                  <Mail className="icon-left" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="input-group">
                  <Lock className="icon-left" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox" />
                  <span className="small-text"> Remember me</span>
                </label>
                <button 
                  className="link-btn small-text"
                  onClick={() => setShowPasswordResetModal(true)}
                >
                  Forgot password?
                </button>
              </div>

              <div className="form-actions">
                <button 
                  onClick={handleLogin} 
                  className="btn-primary"
                  disabled={loading}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading && <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </div>
          )}

          {/* Register Form */}
          {currentPage === 'register' && (
            <div className="form-block fade-in">
              {/* Error Message Display */}
              {errorMessage && (
                <div className="error-message" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  color: '#dc2626'
                }}>
                  <AlertCircle size={20} />
                  <span style={{ fontSize: '14px' }}>{errorMessage}</span>
                </div>
              )}
              
              <div>
                <label className="label">Full Name</label>
                <div className="input-group">
                  <User className="icon-left" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="label">Role</label>
                <div className="input-group">
                  <select name="role" value={formData.role} onChange={handleInputChange} className="form-input">
                    <option value="Patient">Patient</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                  <small className="small-text" style={{color: '#666', marginTop: '4px', display: 'block'}}>
                    {formData.role === 'Patient' && 'Personal healthcare registration'}
                    {formData.role === 'Pharmacist' && 'Professional pharmacy registration'}
                    {formData.role === 'Doctor' && 'Professional medical registration'}
                  </small>
                </div>
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="input-group">
                  <Mail className="icon-left" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="label">Phone Number</label>
                <div className="input-group">
                  <Phone className="icon-left" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Role-specific fields */}
              {renderRoleSpecificFields()}

              <div>
                <label className="label">Password</label>
                <div className="input-group">
                  <Lock className="icon-left" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <label className="checkbox-row">
                <input type="checkbox" className="checkbox" />
                <span className="small-text"> I agree to the Terms of Service and Privacy Policy</span>
              </label>

              <div className="form-actions">
                <button 
                  onClick={handleRegister} 
                  className="btn-primary"
                  disabled={loading}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading && <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="footer-note">
          Protected by industry-standard encryption
        </p>
      </div>
      
      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        initialEmail={formData.email}
      />
    </div>
  );
}
