
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Building2,
  FileText,
  Stethoscope,
  Pill,
  Camera,
  Upload,
  X,
  CheckCircle2,
  ShieldCheck,
  Languages,
  BadgeCheck,
  DollarSign,
  BriefcaseMedical,
  Loader2,
} from 'lucide-react';

import {
  registerDoctor,
  registerPatient,
  registerPharmacist,
} from '../api/api';

const SPECIALIZATIONS = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology',
];

const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
];

const LANGUAGE_OPTIONS = [
  'English',
  'Bengali',
  'Hindi',
  'Arabic',
  'Urdu',
  'French',
  'Spanish',
];

const ROLE_CONFIG = {
  patient: {
    title: 'Create Patient Account',
    description:
      'Manage your healthcare journey with VirtualDoc.',
    icon: User,
    color: 'from-blue-600 to-cyan-500',
    fields: [
      { name: 'username', label: 'Username', type: 'text', icon: User, required: true },
      { name: 'email', label: 'Email Address', type: 'email', icon: Mail, required: true },
      { name: 'password', label: 'Password', type: 'password', icon: Lock, required: true },
      { name: 'firstName', label: 'First Name', type: 'text', icon: User, required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', icon: User, required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', icon: Calendar, required: true },
      {
        name: 'bloodType',
        label: 'Blood Type',
        type: 'select',
        icon: FileText,
        required: true,
        options: BLOOD_TYPES,
      },
      { name: 'address', label: 'Address', type: 'text', icon: MapPin, required: true },
    ],
  },

  doctor: {
    title: 'Join as a Doctor',
    description:
      'Build your professional profile and connect with patients.',
    icon: Stethoscope,
    color: 'from-emerald-600 to-teal-500',
    fields: [
      { name: 'username', label: 'Username', type: 'text', icon: User, required: true },
      { name: 'email', label: 'Email Address', type: 'email', icon: Mail, required: true },
      { name: 'password', label: 'Password', type: 'password', icon: Lock, required: true },
      { name: 'firstName', label: 'First Name', type: 'text', icon: User, required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', icon: User, required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', icon: Calendar, required: true },
      {
        name: 'licenseNumber',
        label: 'Medical License Number',
        type: 'text',
        icon: BadgeCheck,
        required: true,
      },
      {
        name: 'specialization',
        label: 'Specialization',
        type: 'select',
        icon: Stethoscope,
        required: true,
        options: SPECIALIZATIONS,
      },
      {
        name: 'medicalSchool',
        label: 'Medical School',
        type: 'text',
        icon: Building2,
        required: true,
      },
      {
        name: 'yearsOfExperience',
        label: 'Years of Experience',
        type: 'number',
        icon: BriefcaseMedical,
        required: true,
      },
      {
        name: 'consultationFee',
        label: 'Consultation Fee (BDT)',
        type: 'number',
        icon: DollarSign,
        required: true,
      },
      {
        name: 'certifications',
        label: 'Certifications',
        type: 'textarea',
        icon: ShieldCheck,
        required: false,
        placeholder: 'One certification per line',
      },
      {
        name: 'languages',
        label: 'Languages',
        type: 'multiselect',
        icon: Languages,
        required: true,
        options: LANGUAGE_OPTIONS,
      },
      {
        name: 'biography',
        label: 'Professional Biography',
        type: 'textarea',
        icon: FileText,
        required: false,
        placeholder: 'Describe your professional experience...',
      },
    ],
  },

  pharmacist: {
    title: 'Create Pharmacist Account',
    description:
      'Join our pharmacy network and serve patients.',
    icon: Pill,
    color: 'from-purple-600 to-pink-500',
    fields: [
      { name: 'username', label: 'Username', type: 'text', icon: User, required: true },
      { name: 'email', label: 'Email Address', type: 'email', icon: Mail, required: true },
      { name: 'password', label: 'Password', type: 'password', icon: Lock, required: true },
      { name: 'firstName', label: 'First Name', type: 'text', icon: User, required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', icon: User, required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, required: true },
      { name: 'pharmacyName', label: 'Pharmacy Name', type: 'text', icon: Building2, required: true },
      { name: 'licenseNumber', label: 'Pharmacy License Number', type: 'text', icon: BadgeCheck, required: true },
      { name: 'address', label: 'Address', type: 'text', icon: MapPin, required: true },
      { name: 'city', label: 'City', type: 'text', icon: MapPin, required: true },
      { name: 'state', label: 'State / Division', type: 'text', icon: MapPin, required: true },
      { name: 'zipCode', label: 'Zip Code', type: 'text', icon: MapPin, required: true },
    ],
  },
};

const INITIAL_DATA = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  bloodType: '',
  address: '',
  licenseNumber: '',
  specialization: '',
  medicalSchool: '',
  yearsOfExperience: '',
  consultationFee: '',
  certifications: '',
  languages: ['English'],
  biography: '',
  pharmacyName: '',
  city: '',
  state: '',
  zipCode: '',
};

const inputClass = (hasError = false) =>
  `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800
   outline-none transition-all placeholder:text-slate-400
   focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
   ${hasError ? 'border-red-400' : 'border-slate-200'}`;

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(reader.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const RegistrationForm = ({ role, onBack, onSuccess }) => {
  const config = ROLE_CONFIG[role];

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [googleReady, setGoogleReady] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');

  const googleFallbackRef = useRef(null);
  const fileInputRef = useRef(null);

  // Google Sign-In
  useEffect(() => {
    const renderGoogleButton = () => {
      if (!googleFallbackRef.current || !window.google?.accounts?.id) {
        return;
      }

      googleFallbackRef.current.innerHTML = '';

      window.google.accounts.id.renderButton(
        googleFallbackRef.current,
        {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 280,
        }
      );
    };

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id:
          '576024480859-t60g54pu3i72q7s01gn91qorccp0v2cf.apps.googleusercontent.com',

        callback: (response) => {
          if (!response?.credential) return;

          const payload = decodeJwtPayload(response.credential) || {};
          const nameParts = (payload.name || '').trim().split(/\s+/);

          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ');
          const email = payload.email || '';
          const username = email ? email.split('@')[0] : '';

          setFormData((prev) => ({
            ...prev,
            email: email || prev.email,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            username: prev.username || username,
          }));
        },

        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: true,
      });

      setGoogleReady(true);
      renderGoogleButton();
    };

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener('load', initializeGoogle);
      }

      return () => {
        existingScript.removeEventListener('load', initializeGoogle);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.body.appendChild(script);

    return () => {
      script.onload = null;
      setGoogleReady(false);
    };
  }, []);

  // Release image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError('Only JPG, PNG and WebP images are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5MB.');
      event.target.value = '';
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setProfileImage(null);
    setImagePreview('');
    setImageError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    config.fields.forEach((field) => {
      const value = formData[field.name];

      if (
        field.required &&
        (!value ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'string' && !value.trim()))
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (role === 'doctor') {
      const experience = Number(formData.yearsOfExperience);
      const fee = Number(formData.consultationFee);

      if (
        formData.yearsOfExperience !== '' &&
        (!Number.isInteger(experience) || experience < 0 || experience > 80)
      ) {
        newErrors.yearsOfExperience =
          'Enter a valid experience between 0 and 80 years';
      }

      if (
        formData.consultationFee !== '' &&
        (!Number.isFinite(fee) || fee < 0)
      ) {
        newErrors.consultationFee = 'Enter a valid consultation fee';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const prepareDoctorPayload = async () => {
    let profileImageUrl = null;
    if (profileImage) {
      try {
        profileImageUrl = await fileToBase64(profileImage);
      } catch (err) {
        console.warn('Failed to convert profile image to base64:', err);
      }
    }

    const certList = formData.certifications
      ? formData.certifications
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    return {
      Username: formData.username?.trim(),
      Email: formData.email?.trim(),
      Password: formData.password,
      FirstName: formData.firstName?.trim(),
      LastName: formData.lastName?.trim(),
      Phone: formData.phone?.trim(),
      DateOfBirth: formData.dateOfBirth || null,
      LicenseNumber: formData.licenseNumber?.trim(),
      Specialization: formData.specialization,
      MedicalSchool: formData.medicalSchool?.trim(),
      YearsOfExperience: parseInt(formData.yearsOfExperience, 10) || 0,
      Certifications: certList,
      Languages:
        Array.isArray(formData.languages) && formData.languages.length > 0
          ? formData.languages
          : ['English'],
      ConsultationFee: parseFloat(formData.consultationFee) || 0,
      Biography: formData.biography?.trim() || null,
      ProfileImageUrl: profileImageUrl,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let response;

      if (role === 'patient') {
        response = await registerPatient({
          Username: formData.username?.trim(),
          Email: formData.email?.trim(),
          Password: formData.password,
          FirstName: formData.firstName?.trim(),
          LastName: formData.lastName?.trim(),
          Phone: formData.phone?.trim(),
          DateOfBirth: formData.dateOfBirth,
          BloodType: formData.bloodType,
          Address: formData.address?.trim(),
        });
      }

      if (role === 'doctor') {
        const doctorData = await prepareDoctorPayload();
        response = await registerDoctor(doctorData);
      }

      if (role === 'pharmacist') {
        response = await registerPharmacist({
          Username: formData.username?.trim(),
          Email: formData.email?.trim(),
          Password: formData.password,
          FirstName: formData.firstName?.trim(),
          LastName: formData.lastName?.trim(),
          Phone: formData.phone?.trim(),
          PharmacyName: formData.pharmacyName?.trim(),
          LicenseNumber: formData.licenseNumber?.trim(),
          Address: formData.address?.trim(),
          City: formData.city?.trim(),
          State: formData.state?.trim(),
          ZipCode: formData.zipCode?.trim(),
        });
      }

      onSuccess({
        role,
        data: formData,
        response: response?.data,
      });
    } catch (error) {
      console.error('Registration error:', error);

      let serverError = '';
      const resData = error.response?.data;

      if (typeof resData === 'string' && resData.trim()) {
        serverError = resData;
      } else if (resData?.message) {
        serverError = resData.message;
      } else if (resData?.error) {
        serverError = resData.error;
      } else if (resData?.errors && typeof resData.errors === 'object') {
        const fieldErrorMap = {};
        const messages = [];

        Object.entries(resData.errors).forEach(([key, val]) => {
          const list = Array.isArray(val) ? val : [val];
          const text = list.join(' ');
          messages.push(text);

          const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
          fieldErrorMap[camelKey] = text;
        });

        if (messages.length > 0) {
          serverError = messages.join(' ');
          setErrors((prev) => ({ ...prev, ...fieldErrorMap, submit: serverError }));
          return;
        }
      } else if (resData?.title) {
        serverError = resData.title;
      }

      setErrors({ submit: serverError || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (field) => {
    const value = formData[field.name] ?? '';
    const Icon = field.icon;

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className={inputClass(!!errors[field.name])}
          required={field.required}
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'multiselect') {
      return (
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3">
          {field.options.map((option) => {
            const selected = formData.languages.includes(option);

            return (
              <button
                type="button"
                key={option}
                onClick={() => {
                  const next = selected
                    ? formData.languages.filter((item) => item !== option)
                    : [...formData.languages, option];

                  handleChange('languages', next);
                }}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                }`}
              >
                {selected && <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />}
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          rows={field.name === 'biography' ? 5 : 3}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          className={`${inputClass(!!errors[field.name])} resize-none`}
          required={field.required}
        />
      );
    }

    if (field.type === 'password') {
      return (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder="Create a secure password"
            className={`${inputClass(!!errors[field.name])} pr-12`}
            required={field.required}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      );
    }

    return (
      <input
        type={field.type}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={`Enter ${field.label.toLowerCase()}`}
        min={field.type === 'number' ? '0' : undefined}
        className={inputClass(!!errors[field.name])}
        required={field.required}
      />
    );
  };

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Invalid registration role.</p>
      </div>
    );
  }

  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">

          <div
            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${config.color} text-white shadow-lg`}
          >
            <RoleIcon className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {config.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            {config.description}
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          {/* Card Header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-6 sm:px-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  VirtualDoc
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Complete your details to get started.
                </p>
              </div>

              <div className="hidden rounded-2xl bg-emerald-50 p-3 text-emerald-600 sm:block">
                <ShieldCheck className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-10 sm:py-9">
            {/* Google Sign In */}
            <div className="mb-9">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick sign up
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <div
                  ref={googleFallbackRef}
                  className={googleReady ? 'block' : 'hidden'}
                />

                {!googleReady && (
                  <div className="text-sm text-slate-400">
                    Google sign-up is loading...
                  </div>
                )}

                <p className="max-w-md text-center text-xs leading-5 text-slate-400">
                  Google will prefill your name and email. Complete the
                  remaining information to finish registration.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Doctor Profile Image */}
              {role === 'doctor' && (
                <section className="mb-9 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 sm:p-6">
                  <div className="mb-4">
                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                      <Camera className="h-5 w-5 text-emerald-600" />
                      Professional Profile Photo
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Upload a professional photo for your doctor profile.
                      This field is optional.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-5 sm:flex-row">
                    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Selected doctor profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-slate-400">
                          <User className="mx-auto h-12 w-12 stroke-1" />
                          <span className="text-[10px] font-medium">
                            No photo
                          </span>
                        </div>
                      )}

                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute right-0 top-0 rounded-full bg-red-500 p-1.5 text-white shadow-md transition hover:bg-red-600"
                          aria-label="Remove profile image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="doctor-profile-image"
                      />

                      <label
                        htmlFor="doctor-profile-image"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
                      >
                        <Upload className="h-4 w-4" />
                        {imagePreview ? 'Change Photo' : 'Choose Photo'}
                      </label>

                      <p className="mt-3 text-xs text-slate-500">
                        JPG, PNG or WebP · Maximum 5MB
                      </p>

                      {imageError && (
                        <p className="mt-2 text-xs font-medium text-red-600">
                          {imageError}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Fields */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                {config.fields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <div
                      key={field.name}
                      className={
                        field.type === 'textarea' ||
                        field.type === 'multiselect'
                          ? 'md:col-span-2'
                          : ''
                      }
                    >
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </label>

                      <div className="relative">
                        {field.type !== 'multiselect' && (
                          <Icon className="pointer-events-none absolute left-4 top-4 z-10 h-5 w-5 text-slate-400" />
                        )}

                        <div
                          className={
                            field.type === 'multiselect'
                              ? ''
                              : '[&_input]:pl-12 [&_select]:pl-12 [&_textarea]:pl-12'
                          }
                        >
                          {renderInput(field)}
                        </div>
                      </div>

                      {errors[field.name] && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mt-7 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <p className="text-sm font-medium text-red-700">
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="mt-9 border-t border-slate-100 pt-7">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r ${config.color} py-4 text-base font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowLeft className="h-5 w-5 rotate-180" />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  By creating an account, you agree to VirtualDoc's
                  terms of service and privacy policy.
                </p>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} VirtualDoc · Secure Healthcare Platform
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;