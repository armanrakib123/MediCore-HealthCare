import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Calendar, Clock, User, Phone, Mail, FileText, CheckCircle,
  ArrowLeft, CreditCard, Shield, Video, Building2, AlertCircle,
  MapPin, DollarSign, Heart, Activity, Pill, Star, Info
} from 'lucide-react';
import api from '../api/api';

export default function AppointmentBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId } = useParams();
  const [step, setStep] = useState(1); // 1: appointment details, 2: patient info, 3: confirmation
  const [appointmentType, setAppointmentType] = useState(location.state?.appointmentType || 'in-person');
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate || '');
  const [selectedTime, setSelectedTime] = useState(location.state?.selectedTime || '');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    insurance: '',
    insuranceId: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: ''
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Complete doctors database (same as in DoctorProfile)
  const doctorsDatabase = {
    'p1': {
      id: 'p1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      facility: 'MediCore Medical Center',
      address: '123 Medical Plaza, Downtown',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcare.com',
      experience: 15,
      rating: 4.9,
      reviews: 234,
      patientsServed: '5000+',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in interventional cardiology.',
      education: [
        { degree: 'MD, Cardiology', institution: 'Harvard Medical School', year: '2008' },
        { degree: 'Fellowship, Interventional Cardiology', institution: 'Mayo Clinic', year: '2011' },
        { degree: 'BS, Biology', institution: 'Stanford University', year: '2004' }
      ],
      certifications: [
        'Board Certified in Cardiovascular Disease',
        'Board Certified in Interventional Cardiology',
        'Advanced Cardiac Life Support (ACLS)',
        'Fellow of American College of Cardiology'
      ],
      languages: ['English', 'Spanish', 'French'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Medicaid', 'Cigna'],
      services: [
        'Cardiac Catheterization',
        'Coronary Angioplasty',
        'Stent Placement',
        'Heart Disease Management',
        'Preventive Cardiology',
        'Echocardiography'
      ],
      consultationFee: 150,
      followUpFee: 100,
      videoConsultationFee: 120
    },
    'p2': {
      id: 'p2',
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      subSpecialty: 'Child Development',
      facility: 'Children\'s Hospital',
      address: '456 Pediatric Way, Children\'s District',
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@healthcare.com',
      experience: 12,
      rating: 4.8,
      reviews: 189,
      patientsServed: '3200+',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      about: 'Dr. Michael Chen is a dedicated pediatrician specializing in child development with over 12 years of experience.',
      education: [
        { degree: 'MD, Pediatrics', institution: 'Johns Hopkins School of Medicine', year: '2011' },
        { degree: 'Fellowship, Developmental Pediatrics', institution: 'Children\'s Hospital of Philadelphia', year: '2014' },
        { degree: 'BS, Psychology', institution: 'UC Berkeley', year: '2007' }
      ],
      certifications: [
        'Board Certified in Pediatrics',
        'Developmental-Behavioral Pediatrics',
        'Pediatric Advanced Life Support (PALS)',
        'Fellow of American Academy of Pediatrics'
      ],
      languages: ['English', 'Mandarin', 'Cantonese'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Kaiser Permanente', 'Medicaid'],
      services: [
        'Well-Child Visits',
        'Developmental Screenings',
        'Behavioral Assessments',
        'Immunizations',
        'School Physicals',
        'Chronic Disease Management'
      ],
      consultationFee: 120,
      followUpFee: 80,
      videoConsultationFee: 100
    },
    'p3': {
      id: 'p3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      subSpecialty: 'Cosmetic Dermatology',
      facility: 'Skin Care Center',
      address: '789 Dermatology Blvd, Beauty District',
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@healthcare.com',
      experience: 8,
      rating: 4.7,
      reviews: 156,
      patientsServed: '2100+',
      avatar: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80',
      about: 'Dr. Emily Rodriguez is a board-certified dermatologist with expertise in both medical and cosmetic dermatology.',
      education: [
        { degree: 'MD, Dermatology', institution: 'UCLA School of Medicine', year: '2015' },
        { degree: 'Residency, Dermatology', institution: 'Mayo Clinic', year: '2019' },
        { degree: 'BS, Chemistry', institution: 'USC', year: '2011' }
      ],
      certifications: [
        'Board Certified in Dermatology',
        'Cosmetic Dermatology Fellowship',
        'American Board of Dermatology',
        'American Society for Dermatologic Surgery'
      ],
      languages: ['English', 'Spanish'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'Cigna', 'Medicare', 'Self-pay options available'],
      services: [
        'Skin Cancer Screening',
        'Acne Treatment',
        'Botox & Fillers',
        'Laser Treatments',
        'Skin Rejuvenation',
        'Mole Removal'
      ],
      consultationFee: 140,
      followUpFee: 90,
      videoConsultationFee: 110
    },
    'p4': {
      id: 'p4',
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      subSpecialty: 'Sports Medicine',
      facility: 'MediCore Medical Center',
      address: '123 Medical Plaza, Downtown',
      phone: '+1 (555) 456-7890',
      email: 'james.wilson@healthcare.com',
      experience: 20,
      rating: 4.9,
      reviews: 298,
      patientsServed: '4500+',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      about: 'Dr. James Wilson is a leading orthopedic surgeon specializing in sports medicine with over 20 years of experience.',
      education: [
        { degree: 'MD, Orthopedic Surgery', institution: 'Duke University School of Medicine', year: '2003' },
        { degree: 'Fellowship, Sports Medicine', institution: 'Hospital for Special Surgery', year: '2008' },
        { degree: 'BS, Biology', institution: 'University of North Carolina', year: '1999' }
      ],
      certifications: [
        'Board Certified in Orthopedic Surgery',
        'Sports Medicine Subspecialty',
        'Arthroscopy Association of North America',
        'American Orthopedic Society for Sports Medicine'
      ],
      languages: ['English'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Workers Compensation', 'Medicare'],
      services: [
        'Knee Arthroscopy',
        'Shoulder Reconstruction',
        'Sports Injury Treatment',
        'Joint Replacement',
        'Fracture Care',
        'Physical Therapy Coordination'
      ],
      consultationFee: 180,
      followUpFee: 120,
      videoConsultationFee: 150
    },
    'p5': {
      id: 'p5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Neurology',
      subSpecialty: 'Headache & Migraine',
      facility: 'Brain & Spine Institute',
      address: '321 Neurology Center, Medical District',
      phone: '+1 (555) 567-8901',
      email: 'lisa.thompson@healthcare.com',
      experience: 14,
      rating: 4.8,
      reviews: 201,
      patientsServed: '3800+',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      about: 'Dr. Lisa Thompson is a board-certified neurologist specializing in headache and migraine disorders.',
      education: [
        { degree: 'MD, Neurology', institution: 'Yale School of Medicine', year: '2009' },
        { degree: 'Fellowship, Headache Medicine', institution: 'Jefferson Headache Center', year: '2013' },
        { degree: 'BS, Neuroscience', institution: 'MIT', year: '2005' }
      ],
      certifications: [
        'Board Certified in Neurology',
        'Headache Medicine Subspecialty',
        'United Council for Neurologic Subspecialties',
        'American Headache Society'
      ],
      languages: ['English', 'French'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Medicaid'],
      services: [
        'Migraine Treatment',
        'Chronic Headache Management',
        'Botox for Headaches',
        'Neurological Evaluations',
        'EEG Testing',
        'Medication Management'
      ],
      consultationFee: 160,
      followUpFee: 110,
      videoConsultationFee: 130
    },
    'p6': {
      id: 'p6',
      name: 'Dr. Robert Davis',
      specialty: 'General Medicine',
      subSpecialty: 'Family Practice',
      facility: 'Primary Care Clinic',
      address: '654 Family Health Ave, Community Center',
      phone: '+1 (555) 678-9012',
      email: 'robert.davis@healthcare.com',
      experience: 18,
      rating: 4.6,
      reviews: 145,
      patientsServed: '5500+',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      about: 'Dr. Robert Davis is a dedicated family medicine physician with 18 years of experience providing comprehensive healthcare.',
      education: [
        { degree: 'MD, Family Medicine', institution: 'University of Texas Medical School', year: '2005' },
        { degree: 'Residency, Family Medicine', institution: 'Baylor College of Medicine', year: '2008' },
        { degree: 'BS, Biology', institution: 'Texas A&M University', year: '2001' }
      ],
      certifications: [
        'Board Certified in Family Medicine',
        'American Board of Family Medicine',
        'Advanced Cardiac Life Support (ACLS)',
        'Basic Life Support (BLS)'
      ],
      languages: ['English', 'Spanish'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Medicaid', 'Cigna'],
      services: [
        'Annual Physicals',
        'Preventive Care',
        'Chronic Disease Management',
        'Immunizations',
        'Lab Testing',
        'Health Screenings'
      ],
      consultationFee: 100,
      followUpFee: 70,
      videoConsultationFee: 80
    }
  };

  // Load doctor data on component mount
  useEffect(() => {
    const loadDoctorData = async () => {
      setLoading(true);
      
      try {
        let doctorData = null;
        
        // First, try to get doctor from navigation state
        if (location.state?.doctor) {
          doctorData = location.state.doctor;
        }
        // If not in state and we have a doctorId parameter, try to load from database
        else if (doctorId) {
          doctorData = doctorsDatabase[doctorId];
        }
        
        if (doctorData) {
          setDoctor(doctorData);
        } else {
          // Fallback to default doctor if no data found
          setDoctor(doctorsDatabase['p1']);
        }
      } catch (error) {
        console.error('Error loading doctor data:', error);
        setDoctor(doctorsDatabase['p1']);
      } finally {
        setLoading(false);
      }
    };

    loadDoctorData();
  }, [doctorId, location.state]);

  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const reasonOptions = [
    'Annual Check-up',
    'Follow-up Visit',
    'New Symptom',
    'Chronic Condition Management',
    'Preventive Care',
    'Second Opinion',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime || !reasonForVisit) {
        alert('Please fill in all appointment details');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(3);
    }
  };

  const handleBookAppointment = async () => {
    setIsBooking(true);
    setBookingError('');
    
    try {
      const appointmentData = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        appointmentDate: new Date(selectedDate).toISOString().split('T')[0],
        timeSlot: selectedTime,
        reason: reasonForVisit,
        notes: formData.medicalHistory || '',
        patientName: `${formData.firstName} ${formData.lastName}`,
        patientEmail: formData.email
      };
      
      const response = await api.post('/api/appointments', appointmentData);
      
      // Store patient information in localStorage for dashboard access
      if (response.data.appointment && response.data.appointment.patientId) {
        localStorage.setItem('patientId', response.data.appointment.patientId);
        localStorage.setItem('patientName', appointmentData.patientName);
        localStorage.setItem('patientEmail', appointmentData.patientEmail);
      }
      
      setBookingComplete(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const getFee = () => {
    if (!doctor) return '0';
    const fee = appointmentType === 'video' ? doctor.videoConsultationFee : doctor.consultationFee;
    return typeof fee === 'string' ? fee.replace(/[^\d]/g, '') : fee;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment booking...</p>
        </div>
      </div>
    );
  }

  // Doctor not found state
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor for this appointment could not be found.</p>
          <button
            onClick={() => navigate('/doctors')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    // Auto-redirect to patient dashboard after 3 seconds
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/patient-dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }, [navigate]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Appointment Confirmed!</h2>
              <p className="text-green-100">Redirecting to your dashboard...</p>
            </div>

            {/* Appointment Details */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Appointment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-semibold text-gray-800">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold text-gray-800">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold text-gray-800">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold text-gray-800">
                      {appointmentType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-gray-800">{doctor.facility}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-green-200">
                    <span className="text-gray-600">Total Fee</span>
                    <span className="font-bold text-gray-800 text-xl">${getFee()}</span>
                  </div>
                </div>
              </div>

              {/* Confirmation Number */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100 text-center">
                <p className="text-sm text-gray-600 mb-2">Confirmation Number</p>
                <p className="text-2xl font-bold text-blue-600 tracking-wider">APT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  What's Next?
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">A confirmation email has been sent to {formData.email}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">You'll receive a reminder 24 hours before your appointment</span>
                  </li>
                  {appointmentType === 'video' && (
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Video call link will be sent 15 minutes before your appointment</span>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Please arrive 10 minutes early if this is an in-person visit</span>
                  </li>
                </ul>
              </div>

              {/* Actions - Updated to include Dashboard navigation */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/patient-dashboard')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  View in Dashboard
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all">
                    Add to Calendar
                  </button>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="border-2 border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition-all"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Doctors
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Secure Booking</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{doctor.name}</h3>
                  <p className="text-blue-600 text-sm font-semibold">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
                    <span className="text-xs text-gray-500">({doctor.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-800">{doctor.facility}</p>
                    <p className="text-sm text-gray-500">{doctor.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="font-bold text-gray-800 text-lg">${getFee()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Progress Steps */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= s ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                      }`}>
                        {s}
                      </div>
                      {s < 3 && (
                        <div className={`w-16 h-1 mx-2 transition-all ${
                          step > s ? 'bg-white' : 'bg-blue-400'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between max-w-md mx-auto mt-3">
                  <span className="text-xs text-white font-medium">Appointment</span>
                  <span className="text-xs text-white font-medium">Your Info</span>
                  <span className="text-xs text-white font-medium">Confirm</span>
                </div>
              </div>

              <div className="p-8">
                {/* Step 1: Appointment Details */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule Your Appointment</h2>
                      <p className="text-gray-600">Choose your preferred date, time, and appointment type</p>
                    </div>

                    {/* Appointment Type */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Appointment Type</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setAppointmentType('in-person')}
                          className={`p-6 rounded-2xl border-2 transition-all ${
                            appointmentType === 'in-person'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Building2 className={`w-8 h-8 mx-auto mb-3 ${
                            appointmentType === 'in-person' ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <p className={`font-bold ${
                            appointmentType === 'in-person' ? 'text-blue-600' : 'text-gray-700'
                          }`}>In-Person Visit</p>
                          <p className="text-sm text-gray-500 mt-1">${doctor.consultationFee}</p>
                        </button>
                        <button
                          onClick={() => setAppointmentType('video')}
                          className={`p-6 rounded-2xl border-2 transition-all ${
                            appointmentType === 'video'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Video className={`w-8 h-8 mx-auto mb-3 ${
                            appointmentType === 'video' ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <p className={`font-bold ${
                            appointmentType === 'video' ? 'text-blue-600' : 'text-gray-700'
                          }`}>Video Call</p>
                          <p className="text-sm text-gray-500 mt-1">${doctor.videoConsultationFee}</p>
                        </button>
                      </div>
                    </div>

                    {/* New Patient */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Are you a new patient?</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setIsNewPatient(true)}
                          className={`p-4 rounded-xl border-2 font-medium transition-all ${
                            isNewPatient
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Yes, I'm new
                        </button>
                        <button
                          onClick={() => setIsNewPatient(false)}
                          className={`p-4 rounded-xl border-2 font-medium transition-all ${
                            !isNewPatient
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Existing patient
                        </button>
                      </div>
                    </div>

                    {/* Reason for Visit */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Reason for Visit</label>
                      <select
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                      >
                        <option value="">Select a reason...</option>
                        {reasonOptions.map(reason => (
                          <option key={reason} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                              selectedTime === time
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Continue to Patient Information
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                )}

                {/* Step 2: Patient Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Information</h2>
                      <p className="text-gray-600">Please provide your contact and medical details</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                          placeholder="Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                        >
                          <option value="">Select...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-none"
                        placeholder="Your full address"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Insurance Provider</label>
                        <input
                          type="text"
                          name="insurance"
                          value={formData.insurance}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                          placeholder="e.g., BlueCross"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Insurance ID</label>
                        <input
                          type="text"
                          name="insuranceId"
                          value={formData.insuranceId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                          placeholder="Insurance ID number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Allergies (if any)</label>
                      <input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                        placeholder="List any allergies"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="px-8 py-4 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all"
                      >
                        Review Appointment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Confirm</h2>
                      <p className="text-gray-600">Please review your appointment details before confirming</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="font-bold text-gray-800 mb-4">Appointment Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Doctor</span>
                          <span className="font-semibold text-gray-800">{doctor.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date & Time</span>
                          <span className="font-semibold text-gray-800">{selectedDate} at {selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type</span>
                          <span className="font-semibold text-gray-800">
                            {appointmentType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reason</span>
                          <span className="font-semibold text-gray-800">{reasonForVisit}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-blue-200">
                          <span className="text-gray-600">Total Fee</span>
                          <span className="font-bold text-gray-800 text-xl">${getFee()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                      <h3 className="font-bold text-gray-800 mb-4">Patient Information</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-semibold text-gray-800">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-800">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-800">{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-semibold text-gray-800">{formData.dob || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800 text-sm">Cancellation Policy</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Please cancel at least 24 hours in advance to avoid a cancellation fee.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 mt-0.5"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and <a href="#" className="text-blue-600 hover:underline">privacy policy</a>. I understand the cancellation policy and consent to receive appointment reminders.
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="px-8 py-4 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all"
                      >
                        Back
                      </button>
                      {/* Error Display */}
                      {bookingError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-red-700 font-medium">Booking Error</p>
                          </div>
                          <p className="text-red-600 text-sm mt-1">{bookingError}</p>
                        </div>
                      )}

                      <button
                        onClick={handleBookAppointment}
                        disabled={isBooking}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isBooking ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Confirm & Book Appointment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}