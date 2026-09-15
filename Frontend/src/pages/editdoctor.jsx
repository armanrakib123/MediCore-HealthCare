import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, Star, MapPin, Clock, Phone, Mail, Award, GraduationCap, 
  Heart, Users, CheckCircle, Shield, Video, MessageSquare, ArrowLeft,
  ChevronRight, Stethoscope, FileText, DollarSign, Languages, Hospital
} from 'lucide-react';

export default function DoctorProfile() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Complete doctors database
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
      about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in interventional cardiology. She specializes in minimally invasive cardiac procedures and has pioneered several innovative techniques in her field. Dr. Johnson is committed to providing compassionate, patient-centered care and staying at the forefront of cardiovascular medicine.',
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
      availability: {
        monday: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
        tuesday: ['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'],
        wednesday: ['10:00 AM', '2:00 PM', '3:00 PM'],
        thursday: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'],
        friday: ['9:00 AM', '11:00 AM', '1:00 PM']
      },
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
      about: 'Dr. Michael Chen is a dedicated pediatrician specializing in child development with over 12 years of experience. He is passionate about helping children reach their full potential and providing comprehensive care for families. Dr. Chen has extensive training in developmental disorders and childhood behavioral health.',
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
      availability: {
        monday: ['8:00 AM', '9:00 AM', '1:00 PM', '2:00 PM'],
        tuesday: ['9:00 AM', '10:00 AM', '3:00 PM'],
        wednesday: ['8:00 AM', '2:00 PM', '4:00 PM'],
        thursday: ['9:00 AM', '11:00 AM', '1:00 PM'],
        friday: ['8:00 AM', '9:00 AM', '3:00 PM']
      },
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
      about: 'Dr. Emily Rodriguez is a board-certified dermatologist with expertise in both medical and cosmetic dermatology. She has been helping patients achieve healthy, beautiful skin for over 8 years. Dr. Rodriguez stays current with the latest advances in dermatological treatments and cosmetic procedures.',
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
      availability: {
        monday: ['9:00 AM', '10:30 AM', '2:00 PM'],
        tuesday: ['9:00 AM', '11:00 AM', '2:30 PM'],
        wednesday: ['10:00 AM', '1:00 PM', '3:00 PM'],
        thursday: ['9:30 AM', '11:30 AM', '2:00 PM'],
        friday: ['9:00 AM', '10:00 AM', '2:00 PM']
      },
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
      about: 'Dr. James Wilson is a leading orthopedic surgeon specializing in sports medicine with over 20 years of experience. He has treated professional athletes and weekend warriors alike, helping them return to peak performance. Dr. Wilson is known for his minimally invasive surgical techniques and comprehensive rehabilitation programs.',
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
      availability: {
        monday: ['7:00 AM', '8:00 AM', '1:00 PM'],
        tuesday: ['7:00 AM', '9:00 AM', '2:00 PM'],
        wednesday: ['8:00 AM', '1:00 PM', '3:00 PM'],
        thursday: ['7:30 AM', '9:30 AM', '2:30 PM'],
        friday: ['8:00 AM', '1:00 PM']
      },
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
      about: 'Dr. Lisa Thompson is a board-certified neurologist specializing in headache and migraine disorders. With over 14 years of experience, she has helped thousands of patients find relief from chronic headaches. Dr. Thompson is committed to providing personalized treatment plans and staying at the forefront of headache medicine.',
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
      availability: {
        monday: ['9:00 AM', '10:00 AM', '2:00 PM'],
        tuesday: ['9:00 AM', '11:00 AM', '3:00 PM'],
        wednesday: ['10:00 AM', '1:00 PM', '2:30 PM'],
        thursday: ['9:00 AM', '10:30 AM', '2:00 PM'],
        friday: ['9:00 AM', '11:00 AM', '1:00 PM']
      },
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
      about: 'Dr. Robert Davis is a dedicated family medicine physician with 18 years of experience providing comprehensive healthcare to patients of all ages. He believes in building long-term relationships with his patients and providing personalized, compassionate care. Dr. Davis is known for his thorough approach and patient education.',
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
      availability: {
        monday: ['8:00 AM', '9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
        tuesday: ['8:00 AM', '9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
        wednesday: ['8:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
        thursday: ['8:00 AM', '9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'],
        friday: ['8:00 AM', '9:00 AM', '11:00 AM', '1:00 PM']
      },
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

  useEffect(() => {
    // Simulate API call to load doctor data
    const loadDoctorData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const doctorData = doctorsDatabase[doctorId];
      if (doctorData) {
        setDoctor(doctorData);
      } else {
        // Handle case where doctor is not found
        setDoctor(null);
      }
      setLoading(false);
    };

    if (doctorId) {
      loadDoctorData();
    }
  }, [doctorId]);

  // Generate patient reviews based on doctor data
  const patientReviews = doctor ? [
    {
      id: 1,
      patient: 'John M.',
      rating: doctor.rating,
      date: '2 weeks ago',
      comment: `Dr. ${doctor.name.split(' ')[1]} is exceptional! They took the time to explain my condition thoroughly and made me feel comfortable throughout the entire procedure. Highly recommend!`,
      verified: true
    },
    {
      id: 2,
      patient: 'Emily R.',
      rating: Math.min(5, doctor.rating),
      date: '1 month ago',
      comment: `Best ${doctor.specialty.toLowerCase()} I've ever visited. Very knowledgeable, caring, and professional. The staff is also wonderful.`,
      verified: true
    },
    {
      id: 3,
      patient: 'Michael S.',
      rating: Math.max(1, doctor.rating - 1),
      date: '2 months ago',
      comment: 'Great doctor with excellent bedside manner. Wait times can be a bit long, but worth it for the quality of care.',
      verified: true
    }
  ] : [];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    alert(`Appointment booked!\nDoctor: ${doctor.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nType: ${appointmentType}`);
    setShowBookingModal(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  // Doctor not found state
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist or has been removed.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button 
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Doctors
          </button>
        </div>
      </div>

      {/* Doctor Profile Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Doctor Image & Quick Stats */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-48 h-48 rounded-3xl object-cover shadow-2xl border-4 border-white/20"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-800 text-xl">{doctor.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{doctor.reviews} reviews</p>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
                  <p className="text-xl text-blue-100 mb-3">{doctor.specialty}</p>
                  <p className="text-blue-200">{doctor.subSpecialty}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-colors">
                    <MessageSquare className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <Award className="w-6 h-6 text-yellow-300 mb-2" />
                  <p className="text-sm text-blue-100">Experience</p>
                  <p className="text-2xl font-bold">{doctor.experience} years</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <Users className="w-6 h-6 text-green-300 mb-2" />
                  <p className="text-sm text-blue-100">Patients</p>
                  <p className="text-2xl font-bold">{doctor.patientsServed}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <CheckCircle className="w-6 h-6 text-cyan-300 mb-2" />
                  <p className="text-sm text-blue-100">Success Rate</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <Shield className="w-6 h-6 text-purple-300 mb-2" />
                  <p className="text-sm text-blue-100">Board Certified</p>
                  <p className="text-lg font-bold mt-1">Yes</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <Hospital className="w-4 h-4" />
                  <span className="text-sm">{doctor.facility}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{doctor.address}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{doctor.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                About {doctor.name.split(' ')[1]}
              </h2>
              <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
            </div>

            {/* Education & Certifications */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Education & Credentials
              </h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
                <div className="space-y-4">
                  {doctor.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {doctor.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Services Offered
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {doctor.services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Reviews */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  Patient Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-800">{doctor.rating}</span>
                  <span className="text-gray-600">({doctor.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {patientReviews.map((review) => (
                  <div key={review.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.patient[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">{review.patient}</p>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-blue-200 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                View All Reviews
              </button>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Appointment Booking Card */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Book Appointment</h3>

              {/* Consultation Fees */}
              <div className="space-y-3 mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Consultation</span>
                  </div>
                  <span className="font-bold text-gray-800">${doctor.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Video Call</span>
                  </div>
                  <span className="font-bold text-gray-800">${doctor.videoConsultationFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Follow-up</span>
                  </div>
                  <span className="font-bold text-gray-800">${doctor.followUpFee}</span>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Appointment Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAppointmentType('in-person')}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${
                      appointmentType === 'in-person'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Hospital className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">In-Person</span>
                  </button>
                  <button
                    onClick={() => setAppointmentType('video')}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${
                      appointmentType === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Video Call</span>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Time</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 font-medium text-sm transition-all ${
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
                onClick={() => {
                  // Pass doctor data to appointment booking page
                  navigate('/appointment-booking', { 
                    state: { 
                      doctor: doctor,
                      selectedDate: selectedDate,
                      selectedTime: selectedTime,
                      appointmentType: appointmentType
                    } 
                  });
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Go to Full Booking
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-600" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Insurance Accepted
              </h3>
              <div className="space-y-2">
                {doctor.insuranceAccepted.slice(0, 4).map((insurance, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{insurance}</span>
                  </div>
                ))}
                <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 mt-2">
                  View all insurance plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}