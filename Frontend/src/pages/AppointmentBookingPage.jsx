
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
  Video,
  Building2,
  AlertCircle,
  MapPin,
  DollarSign,
  Heart,
  Star,
  Info,
  ChevronRight,
  Lock,
  Stethoscope,
  ClipboardList,
  UserRound,
  BadgeCheck,
  CalendarCheck,
  RefreshCw,
  CreditCard,
  Pill,
  Activity,
  X
} from 'lucide-react';
import api from '../api/api';

export default function AppointmentBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId } = useParams();

  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState(
    location.state?.appointmentType || 'in-person'
  );
  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate || ''
  );
  const [selectedTime, setSelectedTime] = useState(
    location.state?.selectedTime || ''
  );
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  // Load doctor information
  useEffect(() => {
    const loadDoctorData = async () => {
      setLoading(true);
      setBookingError('');

      try {
        let doctorData = null;

        if (location.state?.doctor) {
          doctorData = location.state.doctor;
        } else if (doctorId) {
          const res = await api.get(`/api/doctors/${doctorId}`);
          doctorData = res.data;
        }

        if (!doctorData) {
          const res = await api.get('/api/doctors');
          doctorData =
            Array.isArray(res.data) && res.data.length > 0
              ? res.data[0]
              : null;
        }

        setDoctor(doctorData);
      } catch (error) {
        console.error('Error loading doctor data:', error);
        setBookingError('Unable to load doctor information.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctorData();
  }, [doctorId, location.state]);

  // Redirect after successful booking.
  // This is intentionally at the top level, not inside a conditional.
  useEffect(() => {
    if (!bookingComplete) return;

    const timer = setTimeout(() => {
      navigate('/patient-dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [bookingComplete, navigate]);

  const availableTimes = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM'
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

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    setBookingError('');

    if (step === 1) {
      if (!selectedDate || !selectedTime || !reasonForVisit) {
        setBookingError(
          'Please select an appointment type, date, time, and reason for your visit.'
        );
        return;
      }

      setStep(2);
    } else if (step === 2) {
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        setBookingError(
          'Please complete all required patient information fields.'
        );
        return;
      }

      setStep(3);
    }
  };

  const handleBookAppointment = async () => {
    if (!doctor) return;

    setIsBooking(true);
    setBookingError('');

    try {
      const appointmentData = {
        doctorId: doctor.id || doctor._id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        appointmentDate: new Date(selectedDate)
          .toISOString()
          .split('T')[0],
        timeSlot: selectedTime,
        reason: reasonForVisit,
        notes: formData.medicalHistory || '',
        patientName: `${formData.firstName} ${formData.lastName}`,
        patientEmail: formData.email
      };

      const response = await api.post(
        '/api/appointments',
        appointmentData
      );

      if (response.data.appointment?.patientId) {
        localStorage.setItem(
          'patientId',
          response.data.appointment.patientId
        );
        localStorage.setItem('patientName', appointmentData.patientName);
        localStorage.setItem('patientEmail', appointmentData.patientEmail);
      }

      setConfirmationNumber(
        `APT-${Math.random()
          .toString(36)
          .substring(2, 11)
          .toUpperCase()}`
      );

      setBookingComplete(true);
    } catch (error) {
      console.error('Error booking appointment:', error);

      setBookingError(
        error.response?.data?.message ||
          'Failed to book appointment. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const getFee = () => {
    if (!doctor) return '0';

    const fee =
      appointmentType === 'video'
        ? doctor.videoConsultationFee
        : doctor.consultationFee;

    return typeof fee === 'string'
      ? fee.replace(/[^\d.]/g, '')
      : fee || 0;
  };

  const formatDate = (date) => {
    if (!date) return 'Not selected';

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <Stethoscope className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Preparing your appointment
          </h2>
          <p className="text-slate-500 mt-2">
            Loading doctor information...
          </p>
        </div>
      </div>
    );
  }

  // Doctor not found
  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <UserRound className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Doctor Not Found
          </h2>
          <p className="text-slate-500 mt-3 mb-7">
            We couldn't find the doctor for this appointment.
          </p>

          <button
            onClick={() => navigate('/doctors')}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3.5 font-semibold transition-all"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  // Booking success screen
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-12 sm:px-10 text-center text-white">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-24 translate-x-20" />

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center mb-5 shadow-lg">
                  <CheckCircle className="w-11 h-11 text-emerald-600" />
                </div>

                <p className="text-emerald-100 text-sm font-semibold uppercase tracking-widest mb-2">
                  MediCore Healthcare
                </p>

                <h1 className="text-3xl sm:text-4xl font-extrabold">
                  Appointment Confirmed
                </h1>

                <p className="text-emerald-100 mt-3">
                  Your appointment request has been submitted successfully.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                    Confirmation number
                  </p>
                  <p className="text-xl font-extrabold text-slate-900 tracking-wider mt-1">
                    {confirmationNumber}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Booking submitted
                </span>
              </div>

              <div className="mt-7 rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-100"
                  />

                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                      Your appointment with
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Date
                      </p>
                      <p className="font-semibold text-slate-800 mt-1">
                        {formatDate(selectedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Time
                      </p>
                      <p className="font-semibold text-slate-800 mt-1">
                        {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                      {appointmentType === 'video' ? (
                        <Video className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Consultation
                      </p>
                      <p className="font-semibold text-slate-800 mt-1">
                        {appointmentType === 'video'
                          ? 'Video Consultation'
                          : 'In-Person Visit'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Consultation fee
                      </p>
                      <p className="font-bold text-slate-900 mt-1">
                        ${getFee()}
                      </p>
                    </div>
                  </div>
                </div>

                {appointmentType !== 'video' && doctor.facility && (
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {doctor.facility}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {doctor.address || 'Clinic address will be provided.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900">
                      What happens next?
                    </h4>
                    <ul className="mt-3 space-y-2.5 text-sm text-blue-800">
                      <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        Your appointment details are available in your dashboard.
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        Please check your email for booking updates.
                      </li>
                      {appointmentType === 'video' && (
                        <li className="flex gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          Your video consultation access details will be provided
                          according to the appointment process.
                        </li>
                      )}
                      {appointmentType !== 'video' && (
                        <li className="flex gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          Please arrive a little early for your in-person visit.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/patient-dashboard')}
                  className="sm:col-span-2 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
                >
                  <CalendarCheck className="w-5 h-5" />
                  View Patient Dashboard
                </button>

                <button
                  onClick={() => navigate('/doctors')}
                  className="w-full py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Book Another
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-all"
                >
                  Return Home
                </button>
              </div>

              <p className="text-center text-sm text-slate-400 mt-6">
                Redirecting to your dashboard in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/doctors')}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Doctors</span>
          </button>

          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="hidden sm:inline text-sm font-medium">
              Secure appointment booking
            </span>
            <span className="sm:hidden text-xs font-medium">Secure</span>
          </div>
        </div>
      </header>

      {/* Page Intro */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider mb-3">
                <CalendarCheck className="w-4 h-4" />
                Appointment Center
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                Book your healthcare visit
              </h1>

              <p className="mt-3 text-slate-500 max-w-2xl text-sm sm:text-base">
                Choose your preferred consultation, provide your details,
                and review your appointment before confirming.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
              <Lock className="w-4 h-4 text-emerald-600" />
              Secure booking process
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-7 xl:gap-10 items-start">
          {/* Doctor Summary Sidebar */}
          <aside className="lg:sticky lg:top-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 relative">
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/10 -translate-y-20 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-blue-400/10 translate-y-12 -translate-x-5" />
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-12 relative mb-5 flex items-end justify-between">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-slate-100"
                  />

                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1.5 text-xs font-bold">
                    <BadgeCheck className="w-4 h-4" />
                    Verified
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900">
                  {doctor.name}
                </h2>

                <p className="text-blue-600 font-semibold text-sm mt-1">
                  {doctor.specialty}
                </p>

                {doctor.subSpecialty && (
                  <p className="text-slate-500 text-sm mt-1">
                    {doctor.subSpecialty}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">
                      {doctor.rating || '—'}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400">
                    ({doctor.reviews || 0} reviews)
                  </span>
                </div>

                <div className="h-px bg-slate-100 my-6" />

                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        Facility
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {doctor.facility || 'MediCore Healthcare'}
                      </p>
                      {doctor.address && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {doctor.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        Experience
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {doctor.experience || 0} years of experience
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        Booking protection
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        Secure appointment request
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">
                      Consultation fee
                    </span>
                    <span className="text-xl font-extrabold text-slate-900">
                      ${getFee()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Fee updates automatically with your consultation type.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Booking Panel */}
          <section className="min-w-0">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Progress Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 sm:px-8 py-6 sm:py-7 text-white">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">
                      Booking progress
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold mt-1">
                      {step === 1
                        ? 'Appointment details'
                        : step === 2
                        ? 'Patient information'
                        : 'Review & confirmation'}
                    </h2>
                  </div>

                  <span className="rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-xs font-bold shrink-0">
                    Step {step} of 3
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            step >= s
                              ? 'bg-white text-blue-700 shadow-md'
                              : 'bg-white/15 text-blue-100 border border-white/20'
                          }`}
                        >
                          {step > s ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            s
                          )}
                        </div>

                        <span className="text-[10px] sm:text-xs font-semibold text-blue-100 whitespace-nowrap">
                          {s === 1
                            ? 'Appointment'
                            : s === 2
                            ? 'Your Info'
                            : 'Confirm'}
                        </span>
                      </div>

                      {s < 3 && (
                        <div
                          className={`h-1 flex-1 rounded-full mb-6 transition-all ${
                            step > s ? 'bg-white' : 'bg-white/20'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                {/* Error */}
                {bookingError && (
                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-red-800 text-sm">
                        Please check your information
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {bookingError}
                      </p>
                    </div>
                    <button
                      onClick={() => setBookingError('')}
                      className="text-red-400 hover:text-red-700"
                      aria-label="Dismiss error"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        Schedule your appointment
                      </h3>
                      <p className="text-slate-500 text-sm mt-2">
                        Select the consultation type and a convenient time
                        for your visit.
                      </p>
                    </div>

                    {/* Appointment Type */}
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <label className="text-sm font-bold text-slate-800">
                          01. Consultation type
                        </label>
                        <span className="text-xs text-slate-400">
                          Choose one
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setAppointmentType('in-person')}
                          className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                            appointmentType === 'in-person'
                              ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                              : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                          }`}
                        >
                          {appointmentType === 'in-person' && (
                            <span className="absolute top-4 right-4">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            </span>
                          )}

                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                              appointmentType === 'in-person'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Building2 className="w-6 h-6" />
                          </div>

                          <h4 className="font-bold text-slate-900">
                            In-Person Visit
                          </h4>

                          <p className="text-sm text-slate-500 mt-1">
                            Visit the doctor at the healthcare facility.
                          </p>

                          <p className="text-blue-700 font-extrabold mt-4">
                            ${doctor.consultationFee || 0}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAppointmentType('video')}
                          className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                            appointmentType === 'video'
                              ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                              : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                          }`}
                        >
                          {appointmentType === 'video' && (
                            <span className="absolute top-4 right-4">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            </span>
                          )}

                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                              appointmentType === 'video'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Video className="w-6 h-6" />
                          </div>

                          <h4 className="font-bold text-slate-900">
                            Video Consultation
                          </h4>

                          <p className="text-sm text-slate-500 mt-1">
                            Connect with your doctor remotely.
                          </p>

                          <p className="text-blue-700 font-extrabold mt-4">
                            ${doctor.videoConsultationFee || 0}
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* New Patient */}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-4">
                        02. Are you a new patient?
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setIsNewPatient(true)}
                          className={`p-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                            isNewPatient
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <UserRound className="w-5 h-5 mx-auto mb-2" />
                          Yes, I'm new
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsNewPatient(false)}
                          className={`p-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                            !isNewPatient
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <User className="w-5 h-5 mx-auto mb-2" />
                          Existing patient
                        </button>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-3">
                        03. Reason for your visit
                      </label>

                      <div className="relative">
                        <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <select
                          value={reasonForVisit}
                          onChange={(e) => setReasonForVisit(e.target.value)}
                          className="w-full appearance-none pl-12 pr-10 py-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                        >
                          <option value="">Select a reason...</option>
                          {reasonOptions.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-4">
                        04. Choose your preferred date & time
                      </label>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            Appointment date
                          </label>

                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                              setSelectedDate(e.target.value);
                              setSelectedTime('');
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            Appointment time
                          </label>

                          <div className="grid grid-cols-3 gap-2">
                            {availableTimes.map((time) => (
                              <button
                                type="button"
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`px-1 py-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all ${
                                  selectedTime === time
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                    : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 transition-all"
                      >
                        Continue to Patient Information
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-7">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        Patient information
                      </h3>
                      <p className="text-slate-500 text-sm mt-2">
                        Enter your details so we can prepare your appointment.
                        Fields marked with * are required.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                      <p className="text-sm text-blue-800">
                        Provide accurate information to help the healthcare
                        team manage your appointment.
                      </p>
                    </div>

                    {/* Personal details */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <UserRound className="w-4 h-4 text-blue-600" />
                        Personal details
                      </h4>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="field-label">First name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            className="field-input"
                          />
                        </div>

                        <div>
                          <label className="field-label">Last name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className="field-input"
                          />
                        </div>

                        <div>
                          <label className="field-label">Email address *</label>
                          <div className="relative">
                            <Mail className="field-icon" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="you@example.com"
                              className="field-input pl-11"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="field-label">Phone number *</label>
                          <div className="relative">
                            <Phone className="field-icon" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+880 1XXXXXXXXX"
                              className="field-input pl-11"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="field-label">Date of birth</label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="field-input"
                          />
                        </div>

                        <div>
                          <label className="field-label">Gender</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="field-input bg-white"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Contact & address
                      </h4>

                      <label className="field-label">Full address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter your full address"
                        className="field-input resize-none"
                      />
                    </div>

                    {/* Insurance */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        Insurance information
                        <span className="text-xs text-slate-400 font-normal">
                          (Optional)
                        </span>
                      </h4>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="field-label">
                            Insurance provider
                          </label>
                          <input
                            type="text"
                            name="insurance"
                            value={formData.insurance}
                            onChange={handleInputChange}
                            placeholder="Insurance provider"
                            className="field-input"
                          />
                        </div>

                        <div>
                          <label className="field-label">Insurance ID</label>
                          <input
                            type="text"
                            name="insuranceId"
                            value={formData.insuranceId}
                            onChange={handleInputChange}
                            placeholder="Insurance ID number"
                            className="field-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Medical details */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Heart className="w-4 h-4 text-blue-600" />
                        Medical details
                        <span className="text-xs text-slate-400 font-normal">
                          (Optional)
                        </span>
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="field-label">Allergies</label>
                          <input
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleInputChange}
                            placeholder="List any known allergies"
                            className="field-input"
                          />
                        </div>

                        <div>
                          <label className="field-label">
                            Current medications
                          </label>
                          <textarea
                            name="currentMedications"
                            value={formData.currentMedications}
                            onChange={handleInputChange}
                            rows="2"
                            placeholder="List any current medications"
                            className="field-input resize-none"
                          />
                        </div>

                        <div>
                          <label className="field-label">
                            Medical history / notes
                          </label>
                          <textarea
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Share relevant medical history or additional notes"
                            className="field-input resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingError('');
                          setStep(1);
                        }}
                        className="sm:w-32 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        Review Appointment
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="space-y-7">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        Review & confirm
                      </h3>
                      <p className="text-slate-500 text-sm mt-2">
                        Review your details carefully before submitting your
                        appointment request.
                      </p>
                    </div>

                    {/* Appointment summary */}
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-3">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <CalendarCheck className="w-5 h-5 text-blue-600" />
                          Appointment details
                        </h4>

                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900">
                              {doctor.name}
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                              {doctor.specialty}
                            </p>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="summary-label">Date</p>
                            <p className="summary-value">
                              {formatDate(selectedDate)}
                            </p>
                          </div>

                          <div>
                            <p className="summary-label">Time</p>
                            <p className="summary-value">{selectedTime}</p>
                          </div>

                          <div>
                            <p className="summary-label">Consultation type</p>
                            <p className="summary-value">
                              {appointmentType === 'video'
                                ? 'Video Consultation'
                                : 'In-Person Visit'}
                            </p>
                          </div>

                          <div>
                            <p className="summary-label">Patient status</p>
                            <p className="summary-value">
                              {isNewPatient
                                ? 'New patient'
                                : 'Existing patient'}
                            </p>
                          </div>

                          <div className="sm:col-span-2">
                            <p className="summary-label">Reason for visit</p>
                            <p className="summary-value">{reasonForVisit}</p>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-slate-600">
                            Total consultation fee
                          </span>
                          <span className="text-2xl font-extrabold text-slate-900">
                            ${getFee()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Patient summary */}
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-3">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <UserRound className="w-5 h-5 text-blue-600" />
                          Patient information
                        </h4>

                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="p-5 grid sm:grid-cols-2 gap-5">
                        <div>
                          <p className="summary-label">Full name</p>
                          <p className="summary-value">
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>

                        <div>
                          <p className="summary-label">Email</p>
                          <p className="summary-value break-all">
                            {formData.email}
                          </p>
                        </div>

                        <div>
                          <p className="summary-label">Phone</p>
                          <p className="summary-value">{formData.phone}</p>
                        </div>

                        <div>
                          <p className="summary-label">Date of birth</p>
                          <p className="summary-value">
                            {formData.dob || 'Not provided'}
                          </p>
                        </div>

                        <div>
                          <p className="summary-label">Gender</p>
                          <p className="summary-value">
                            {formData.gender || 'Not provided'}
                          </p>
                        </div>

                        <div>
                          <p className="summary-label">Allergies</p>
                          <p className="summary-value">
                            {formData.allergies || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cancellation policy */}
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm">
                          Cancellation policy
                        </h4>
                        <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                          Please cancel at least 24 hours in advance to avoid
                          a cancellation fee, according to the applicable
                          appointment policy.
                        </p>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        I agree to the appointment terms and privacy policy. I
                        understand the cancellation policy and consent to
                        receive appointment-related reminders.
                      </span>
                    </label>

                    {/* Navigation */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingError('');
                          setStep(2);
                        }}
                        className="sm:w-32 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBookAppointment}
                        disabled={isBooking || !termsAccepted}
                        className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                      >
                        {isBooking ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Booking appointment...
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

            {/* Bottom trust indicators */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Secure process
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Protected booking flow
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Easy scheduling
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Choose your preferred time
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Patient-first care
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your care matters
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Component-local utility classes */}
      <style>{`
        .field-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .field-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          color: #334155;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          background: white;
          transition: all 0.2s ease;
        }

        .field-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .field-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px #eff6ff;
        }

        .field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.125rem;
          height: 1.125rem;
          color: #94a3b8;
          pointer-events: none;
        }

        .summary-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 0.3rem;
        }

        .summary-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}