import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, User, Lock } from 'lucide-react';
import { login, loginFacebook, loginGoogle, loginAppleId } from '../api/api';

const LoginForm = ({ onBack, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [googleReady, setGoogleReady] = useState(false);
  const [showGoogleFallback, setShowGoogleFallback] = useState(false);
  const googleFallbackRef = useRef(null);

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

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: '576024480859-t60g54pu3i72q7s01gn91qorccp0v2cf.apps.googleusercontent.com',
        callback: async (response) => {
          if (!response?.credential) return;
          setIsLoading(true);
          try {
            const payload = decodeJwtPayload(response.credential) || {};
            const apiResponse = await loginGoogle({
              idToken: response.credential,
              email: payload.email,
              fullName: payload.name,
              avatarUrl: payload.picture,
              providerId: payload.sub
            });
            onSuccess({ response: apiResponse.data });
          } catch (error) {
            console.error('Google login error:', error);
            setErrors({ submit: error.response?.data || 'Google login failed. Please try again.' });
          } finally {
            setIsLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: true
      });

      setGoogleReady(true);
      renderGoogleFallbackButton();
    };

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
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
  }, [onSuccess]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Determine which login API to use based on the user's role
      // Since we don't know the role yet, we'll try the general login first
      const response = await login({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password
      });
      
      const data = response.data;
      const token = data.token || data.Token;
      const username = data.username || data.Username;
      const role = data.role || data.Role;
      const avatarColor = data.avatarColor;
      const avatarEmoji = data.avatarEmoji;
      const profileImageUrl = data.profileImageUrl;
      
      if (!token) throw new Error('No token returned from server');
      
      // Store complete user data including avatar
      const userData = {
        username,
        role,
        avatarColor,
        avatarEmoji,
        profileImageUrl: profileImageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        email: formData.usernameOrEmail.includes('@') ? formData.usernameOrEmail : ''
      };
      
      onSuccess({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
        response: data
      });
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: error.response?.data || 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'google') {
      if (!googleReady || !window.google?.accounts?.id) {
        setErrors({ submit: 'Google login is not ready yet. Please try again.' });
        return;
      }

      setErrors((prev) => ({ ...prev, submit: '' }));
      setShowGoogleFallback(false);

      window.google.accounts.id.prompt((notification) => {
        if (!notification) return;

        const notDisplayed = typeof notification.isNotDisplayed === 'function' && notification.isNotDisplayed();
        const skipped = typeof notification.isSkippedMoment === 'function' && notification.isSkippedMoment();

        if (notDisplayed || skipped) {
          setShowGoogleFallback(true);
          setErrors({ submit: 'Popup was blocked or not shown. Use the Google fallback button below.' });
        }
      });

      return;
    }

    const providerLabel = provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'Apple ID';
    const email = formData.usernameOrEmail?.includes('@')
      ? formData.usernameOrEmail.trim()
      : window.prompt(`Enter your ${providerLabel} email`);

    if (!email) return;

    const fullName = window.prompt(`Enter your ${providerLabel} name (optional)`) || '';

    setIsLoading(true);
    try {
      const payload = {
        email,
        fullName,
        providerId: email,
        avatarUrl: ''
      };

      const response =
        provider === 'google'
          ? await loginGoogle(payload)
          : provider === 'facebook'
          ? await loginFacebook(payload)
          : await loginAppleId(payload);

      onSuccess({ response: response.data });
    } catch (error) {
      console.error('Social login error:', error);
      setErrors({ submit: error.response?.data || 'Social login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Role Selection
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl text-white shadow-lg mb-4">
            <User className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your MediCore account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username or Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={formData.usernameOrEmail}
                  onChange={(e) => handleChange('usernameOrEmail', e.target.value)}
                  className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.usernameOrEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your username or email"
                  required
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.usernameOrEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Or continue with</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                aria-label="Continue with Google"
                className="group w-full rounded-2xl border border-gray-200 bg-white py-3 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.36 1.54 8.29 3.29l6.1-6.1C34.73 3.2 29.77 1 24 1 14.62 1 6.54 6.38 2.7 14.6l7.2 5.59C11.77 13.09 17.44 9.5 24 9.5z" />
                  <path fill="#34A853" d="M46.5 24.5c0-1.7-.15-3.32-.43-4.9H24v9.3h12.7c-.55 2.96-2.23 5.47-4.73 7.17l7.27 5.62C43.86 37.1 46.5 31.3 46.5 24.5z" />
                  <path fill="#FBBC05" d="M9.9 28.2c-.5-1.48-.78-3.05-.78-4.7s.28-3.22.78-4.7l-7.2-5.59C1.63 15.9 1 19.64 1 23.5s.63 7.6 1.7 10.79l7.2-5.59z" />
                  <path fill="#4285F4" d="M24 46c6.48 0 11.93-2.14 15.9-5.81l-7.27-5.62c-2.02 1.36-4.6 2.18-8.63 2.18-6.56 0-12.23-3.59-14.1-8.69l-7.2 5.59C6.54 41.62 14.62 46 24 46z" />
                </svg>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                aria-label="Continue with Facebook"
                className="group w-full rounded-2xl border border-gray-200 bg-white py-3 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08V12.07h3.05V9.41c0-3.03 1.79-4.7 4.54-4.7 1.32 0 2.7.24 2.7.24v2.96H15.8c-1.49 0-1.95.93-1.95 1.88v2.28h3.32l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                </svg>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">Facebook</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                aria-label="Continue with Apple ID"
                className="group w-full rounded-2xl border border-gray-200 bg-white py-3 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#111111" d="M16.36 13.2c.03 3.23 2.83 4.3 2.86 4.32-.02.07-.45 1.52-1.47 3.01-.88 1.28-1.8 2.56-3.24 2.59-1.42.03-1.88-.84-3.51-.84-1.62 0-2.14.81-3.49.87-1.39.06-2.45-1.4-3.35-2.68-1.83-2.65-3.22-7.5-1.35-10.77.93-1.62 2.6-2.64 4.41-2.67 1.37-.03 2.66.93 3.5.93.83 0 2.4-1.15 4.04-.98.69.03 2.63.28 3.88 2.12-.1.06-2.32 1.35-2.3 4.08z" />
                  <path fill="#111111" d="M14.06 3.5c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.13 1.6-.69.78-1.3 2.05-1.13 3.25 1.2.09 2.42-.62 3.16-1.45z" />
                </svg>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">Apple ID</span>
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">Quick, secure sign-in with your preferred provider.</p>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div ref={googleFallbackRef} className={showGoogleFallback ? 'block' : 'hidden'} />
              {showGoogleFallback && (
                <p className="text-xs text-amber-700 text-center">If Safari/Chrome blocks One Tap, use this fallback button.</p>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onBack}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;