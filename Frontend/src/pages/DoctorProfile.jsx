import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, Star, MapPin, Clock, Phone, Mail, Award, GraduationCap, 
  Heart, Users, CheckCircle, Shield, Video, MessageSquare, ArrowLeft,
  ChevronRight, ChevronLeft, Stethoscope, FileText, DollarSign, Languages, Hospital,
  User, Sparkles, ThumbsUp, Activity, Globe
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
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  // Enhanced doctors database with more comprehensive data
  const doctorsDatabase = {
    'p1': {
      id: 'p1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      facility: 'MediCore Medical Center',
      address: '123 Medical Plaza, Downtown Medical District',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcare.com',
      experience: 15,
      rating: 4.9,
      reviews: 234,
      patientsServed: '5000+',
      successRate: 98,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
      about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in interventional cardiology. She specializes in minimally invasive cardiac procedures and has pioneered several innovative techniques in her field. Dr. Johnson is committed to providing compassionate, patient-centered care and staying at the forefront of cardiovascular medicine. Her research has been published in numerous medical journals and she regularly speaks at international cardiology conferences.',
      philosophy: 'I believe in treating not just the condition, but the whole person. Every patient deserves personalized care that considers their unique circumstances, preferences, and goals.',
      achievements: [
        'Top Cardiologist Award 2023',
        'Innovation in Cardiac Care Recognition',
        'Patient Safety Excellence Award',
        'Research Excellence in Interventional Cardiology'
      ],
      publications: [
        'Advanced Techniques in Minimally Invasive Cardiac Procedures - Journal of Cardiology 2023',
        'Patient Outcomes in Interventional Cardiology - Medical Review 2022',
        'Future of Cardiac Care Technology - Healthcare Innovation 2022'
      ],
      education: [
        { degree: 'MD, Cardiology', institution: 'Harvard Medical School', year: '2008', honors: 'Summa Cum Laude' },
        { degree: 'Fellowship, Interventional Cardiology', institution: 'Mayo Clinic', year: '2011', honors: 'Outstanding Fellow Award' },
        { degree: 'BS, Biology', institution: 'Stanford University', year: '2004', honors: 'Phi Beta Kappa' }
      ],
      certifications: [
        'Board Certified in Cardiovascular Disease',
        'Board Certified in Interventional Cardiology',
        'Advanced Cardiac Life Support (ACLS)',
        'Fellow of American College of Cardiology',
        'Registered Cardiovascular Interventional Specialist'
      ],
      languages: ['English', 'Spanish', 'French'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Medicaid', 'Cigna', 'Humana', 'Kaiser Permanente'],
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
        'Echocardiography',
        'Cardiac Rehabilitation',
        'Hypertension Management'
      ],
      consultationFee: 150,
      followUpFee: 100,
      videoConsultationFee: 120,
      voiceConsultationFee: 100
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
      successRate: 96,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00b0cffk9a?auto=format&fit=crop&w=1200&q=80',
      about: 'Dr. Michael Chen is a dedicated pediatrician specializing in child development with over 12 years of experience. He is passionate about helping children reach their full potential and providing comprehensive care for families. Dr. Chen has extensive training in developmental disorders and childhood behavioral health.',
      philosophy: 'Every child is unique and deserves care that honors their individual journey. I work with families to create supportive environments where children can thrive.',
      achievements: [
        'Pediatric Excellence Award 2023',
        'Child Development Specialist Certification',
        'Family-Centered Care Recognition'
      ],
      publications: [
        'Early Intervention in Child Development - Pediatric Journal 2023',
        'Family Dynamics in Child Health - Child Health Review 2022'
      ],
      education: [
        { degree: 'MD, Pediatrics', institution: 'Johns Hopkins School of Medicine', year: '2011', honors: 'Alpha Omega Alpha' },
        { degree: 'Fellowship, Developmental Pediatrics', institution: 'Children\'s Hospital of Philadelphia', year: '2014', honors: 'Research Excellence Award' },
        { degree: 'BS, Psychology', institution: 'UC Berkeley', year: '2007', honors: 'Magna Cum Laude' }
      ],
      certifications: [
        'Board Certified in Pediatrics',
        'Developmental-Behavioral Pediatrics',
        'Pediatric Advanced Life Support (PALS)',
        'Fellow of American Academy of Pediatrics'
      ],
      languages: ['English', 'Mandarin', 'Cantonese'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Kaiser Permanente', 'Medicaid', 'CHIP'],
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
        'Chronic Disease Management',
        'ADHD Evaluation',
        'Autism Spectrum Disorder Support'
      ],
      consultationFee: 120,
      followUpFee: 80,
      videoConsultationFee: 100,
      voiceConsultationFee: 85
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
      successRate: 94,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      coverImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80',
      about: 'Dr. Emily Rodriguez is a board-certified dermatologist with expertise in both medical and cosmetic dermatology. She has been helping patients achieve healthy, beautiful skin for over 8 years. Dr. Rodriguez stays current with the latest advances in dermatological treatments and cosmetic procedures.',
      philosophy: 'Healthy skin is the foundation of confidence. I combine medical expertise with cosmetic artistry to help patients look and feel their best.',
      achievements: [
        'Dermatology Innovation Award 2023',
        'Cosmetic Dermatology Excellence',
        'Patient Satisfaction Recognition'
      ],
      publications: [
        'Advances in Cosmetic Dermatology - Dermatology Review 2023',
        'Skin Health and Aging - Medical Aesthetics Journal 2022'
      ],
      education: [
        { degree: 'MD, Dermatology', institution: 'UCLA School of Medicine', year: '2015', honors: 'Alpha Omega Alpha' },
        { degree: 'Residency, Dermatology', institution: 'Mayo Clinic', year: '2019', honors: 'Chief Resident' },
        { degree: 'BS, Chemistry', institution: 'USC', year: '2011', honors: 'Summa Cum Laude' }
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
        'Mole Removal',
        'Rosacea Treatment',
        'Anti-Aging Therapies'
      ],
      consultationFee: 140,
      followUpFee: 90,
      videoConsultationFee: 110,
      voiceConsultationFee: 95
    },
    'p4': {
      id: 'p4',
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      subSpecialty: 'Sports Medicine',
      facility: 'Orthopedic Sports Center',
      address: '321 Sports Medicine Ave, Athletic District',
      phone: '+1 (555) 456-7890',
      email: 'james.wilson@healthcare.com',
      experience: 18,
      rating: 4.8,
      reviews: 312,
      patientsServed: '4200+',
      successRate: 97,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1200&q=80',
      about: 'Dr. James Wilson is a renowned orthopedic surgeon specializing in sports medicine with over 18 years of experience. He has treated professional athletes and weekend warriors alike, helping them return to peak performance. Dr. Wilson is known for his innovative minimally invasive techniques and comprehensive approach to musculoskeletal care.',
      philosophy: 'Every athlete deserves to perform at their best. I combine cutting-edge surgical techniques with personalized rehabilitation to help my patients achieve their goals.',
      achievements: [
        'Sports Medicine Excellence Award 2023',
        'Team Physician for State Championship Teams',
        'Minimally Invasive Surgery Innovation',
        'Athletic Performance Enhancement Recognition'
      ],
      publications: [
        'Advanced Arthroscopic Techniques in Sports Medicine - Journal of Orthopedic Surgery 2023',
        'Recovery Optimization in Athletic Injuries - Sports Medicine Review 2022',
        'Preventive Strategies for Sports-Related Injuries - Athletic Health Journal 2022'
      ],
      education: [
        { degree: 'MD, Orthopedic Surgery', institution: 'Johns Hopkins School of Medicine', year: '2005', honors: 'Alpha Omega Alpha' },
        { degree: 'Fellowship, Sports Medicine', institution: 'Hospital for Special Surgery', year: '2009', honors: 'Outstanding Fellow Award' },
        { degree: 'BS, Kinesiology', institution: 'University of California, Berkeley', year: '2001', honors: 'Summa Cum Laude' }
      ],
      certifications: [
        'Board Certified in Orthopedic Surgery',
        'Sports Medicine Subspecialty Certification',
        'American Board of Orthopedic Surgery',
        'Fellow of American Academy of Orthopedic Surgeons',
        'Arthroscopy Association of North America'
      ],
      languages: ['English', 'Spanish', 'Portuguese'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Cigna', 'Humana', 'Workers Compensation'],
      availability: {
        monday: ['7:00 AM', '8:00 AM', '1:00 PM', '2:00 PM'],
        tuesday: ['7:00 AM', '9:00 AM', '3:00 PM'],
        wednesday: ['8:00 AM', '1:00 PM', '4:00 PM'],
        thursday: ['7:00 AM', '8:00 AM', '2:00 PM', '3:00 PM'],
        friday: ['7:00 AM', '9:00 AM', '1:00 PM']
      },
      services: [
        'Arthroscopic Surgery',
        'Knee Reconstruction',
        'Shoulder Repair',
        'Sports Injury Treatment',
        'Joint Replacement',
        'Fracture Care',
        'Physical Therapy Coordination',
        'Performance Optimization'
      ],
      consultationFee: 180,
      followUpFee: 120,
      videoConsultationFee: 150,
      voiceConsultationFee: 125
    },
    'p5': {
      id: 'p5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Neurology',
      subSpecialty: 'Stroke Treatment',
      facility: 'Neurological Institute',
      address: '654 Brain Health Blvd, Medical District',
      phone: '+1 (555) 567-8901',
      email: 'lisa.thompson@healthcare.com',
      experience: 14,
      rating: 4.9,
      reviews: 278,
      patientsServed: '3800+',
      successRate: 95,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80',
      about: 'Dr. Lisa Thompson is a leading neurologist specializing in stroke treatment and neurological emergency care with over 14 years of experience. She has been instrumental in developing rapid response protocols that have saved countless lives. Dr. Thompson is passionate about patient education and preventive care in neurological health.',
      philosophy: 'Time is brain in neurological emergencies. Every second counts, and I am committed to providing rapid,精准 care while treating each patient with compassion and dignity.',
      achievements: [
        'Neurological Excellence Award 2023',
        'Stroke Care Innovation Recognition',
        'Patient Safety Leadership Award',
        'Research Excellence in Stroke Treatment'
      ],
      publications: [
        'Rapid Response Protocols in Stroke Care - Neurology Journal 2023',
        'Advanced Neuroimaging in Emergency Neurology - Stroke Review 2022',
        'Patient Outcomes in Acute Stroke Treatment - Medical Emergency Journal 2022'
      ],
      education: [
        { degree: 'MD, Neurology', institution: 'Harvard Medical School', year: '2009', honors: 'Alpha Omega Alpha' },
        { degree: 'Fellowship, Vascular Neurology', institution: 'Mayo Clinic', year: '2012', honors: 'Outstanding Fellow Award' },
        { degree: 'BS, Neuroscience', institution: 'MIT', year: '2005', honors: 'Phi Beta Kappa' }
      ],
      certifications: [
        'Board Certified in Neurology',
        'Vascular Neurology Subspecialty',
        'American Board of Psychiatry and Neurology',
        'Advanced Cardiac Life Support (ACLS)',
        'Fellow of American Academy of Neurology'
      ],
      languages: ['English', 'Mandarin', 'French'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Medicaid', 'Cigna', 'Humana'],
      availability: {
        monday: ['8:00 AM', '9:00 AM', '1:00 PM', '3:00 PM'],
        tuesday: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'],
        wednesday: ['8:00 AM', '11:00 AM', '1:00 PM'],
        thursday: ['9:00 AM', '2:00 PM', '3:00 PM'],
        friday: ['8:00 AM', '10:00 AM', '1:00 PM']
      },
      services: [
        'Stroke Treatment',
        'Neurological Emergency Care',
        'Brain Imaging Interpretation',
        'Seizure Disorders',
        'Headache Management',
        'Cognitive Assessment',
        'Neuro-rehabilitation',
        'Preventive Neurology'
      ],
      consultationFee: 200,
      followUpFee: 130,
      videoConsultationFee: 160,
      voiceConsultationFee: 140
    },
    'p6': {
      id: 'p6',
      name: 'Dr. Robert Martinez',
      specialty: 'Gastroenterology',
      subSpecialty: 'Hepatology',
      facility: 'Digestive Health Center',
      address: '987 Gastroenterology Way, Digestive District',
      phone: '+1 (555) 678-9012',
      email: 'robert.martinez@healthcare.com',
      experience: 11,
      rating: 4.6,
      reviews: 198,
      patientsServed: '2900+',
      successRate: 93,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80',
      about: 'Dr. Robert Martinez is a board-certified gastroenterologist with expertise in hepatology and liver diseases. He has been treating complex digestive disorders for over 11 years, with a special focus on liver health and transplantation support. Dr. Martinez is known for his thorough diagnostic approach and personalized treatment plans.',
      philosophy: 'Digestive health is fundamental to overall wellness. I believe in thorough evaluation, patient education, and collaborative care to achieve the best outcomes for my patients.',
      achievements: [
        'Gastroenterology Innovation Award 2023',
        'Liver Disease Research Excellence',
        'Patient Care Quality Recognition',
        'Endoscopy Excellence Certification'
      ],
      publications: [
        'Advances in Hepatology Treatment - Gastroenterology Journal 2023',
        'Liver Disease Management Strategies - Digestive Health Review 2022',
        'Endoscopic Innovation in GI Care - Medical Innovation Journal 2022'
      ],
      education: [
        { degree: 'MD, Internal Medicine', institution: 'UCSF School of Medicine', year: '2012', honors: 'Alpha Omega Alpha' },
        { degree: 'Fellowship, Gastroenterology', institution: 'Cleveland Clinic', year: '2015', honors: 'Chief Fellow' },
        { degree: 'BS, Biology', institution: 'Stanford University', year: '2008', honors: 'Magna Cum Laude' }
      ],
      certifications: [
        'Board Certified in Gastroenterology',
        'Hepatology Subspecialty',
        'American Board of Internal Medicine',
        'Advanced Endoscopy Certification',
        'American College of Gastroenterology'
      ],
      languages: ['English', 'Spanish', 'Italian'],
      insuranceAccepted: ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Cigna', 'Humana', 'Kaiser Permanente'],
      availability: {
        monday: ['9:00 AM', '10:00 AM', '1:00 PM', '2:00 PM'],
        tuesday: ['9:00 AM', '11:00 AM', '3:00 PM'],
        wednesday: ['8:00 AM', '10:00 AM', '1:00 PM'],
        thursday: ['9:00 AM', '2:00 PM', '4:00 PM'],
        friday: ['8:00 AM', '10:00 AM', '1:00 PM']
      },
      services: [
        'Endoscopy Procedures',
        'Liver Disease Treatment',
        'Colonoscopy Screening',
        'IBD Management',
        'Acid Reflux Treatment',
        'Liver Biopsy',
        'Hepatitis Management',
        'Digestive Health Optimization'
      ],
      consultationFee: 160,
      followUpFee: 110,
      videoConsultationFee: 130,
      voiceConsultationFee: 110
    }
  };

  // Get all doctor IDs for navigation
  const doctorIds = Object.keys(doctorsDatabase);
  const currentIndex = doctorIds.indexOf(doctorId);
  const prevDoctorId = currentIndex > 0 ? doctorIds[currentIndex - 1] : null;
  const nextDoctorId = currentIndex < doctorIds.length - 1 ? doctorIds[currentIndex + 1] : null;

  useEffect(() => {
    const loadDoctorData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const doctorData = doctorsDatabase[doctorId];
      if (doctorData) {
        setDoctor(doctorData);
      } else {
        setDoctor(null);
      }
      setLoading(false);
    };

    if (doctorId) {
      loadDoctorData();
    } else {
      setLoading(false);
    }
  }, [doctorId]);

  // Enhanced patient reviews
  const patientReviews = doctor ? [
    {
      id: 1,
      patient: 'John M.',
      rating: doctor.rating,
      date: '2 weeks ago',
      comment: `Dr. ${doctor.name.split(' ')[1]} is exceptional! They took the time to explain my condition thoroughly and made me feel comfortable throughout the entire procedure. Highly recommend!`,
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      patient: 'Emily R.',
      rating: Math.min(5, doctor.rating),
      date: '1 month ago',
      comment: `Best ${doctor.specialty.toLowerCase()} I've ever visited. Very knowledgeable, caring, and professional. The staff is also wonderful.`,
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      patient: 'Michael S.',
      rating: Math.max(1, doctor.rating - 1),
      date: '2 months ago',
      comment: 'Great doctor with excellent bedside manner. Wait times can be a bit long, but worth it for the quality of care.',
      verified: true,
      helpful: 15
    },
    {
      id: 4,
      patient: 'Sarah L.',
      rating: 5,
      date: '3 weeks ago',
      comment: `Dr. ${doctor.name.split(' ')[1]} went above and beyond my expectations. The treatment plan was comprehensive and the results speak for themselves.`,
      verified: true,
      helpful: 6
    }
  ] : [];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }
    setShowBookingModal(true);
  };

  const handleStartVideoCall = () => {
    navigate('/call-selection', { state: { doctorId: doctorId } });
  };

  const handleStartVoiceCall = () => {
    navigate('/call-button-page', { state: { doctorId: doctorId, callType: 'voice' } });
  };

  const confirmBooking = () => {
    const typeText = appointmentType === 'video' ? 'Video Consultation' : 
                     appointmentType === 'voice' ? 'Voice Call' : 'In-Person Visit';
    alert(`Appointment booked!\nDoctor: ${doctor.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nType: ${typeText}`);
    setShowBookingModal(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  const getTodaySlots = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const todayName = days[today];
    return doctor?.availability[todayName] || [];
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Doctor Profile</h3>
          <p className="text-gray-600">Preparing comprehensive information...</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2 w-64 mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Doctor not found state
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist or has been removed.</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/doctors')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Doctors
            </button>
            <p className="text-sm text-gray-500">Available doctors: {Object.keys(doctorsDatabase).join(', ')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with Cover Image */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        
        {/* Navigation Bar */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => navigate('/doctors')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white/90 hover:text-white font-medium transition-all duration-300 rounded-xl border border-white/20 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Doctors
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80 bg-white/10 px-3 py-1 rounded-full">
                Doctor {currentIndex + 1} of {doctorIds.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => prevDoctorId && navigate(`/doctor-profile-premium/${prevDoctorId}`)}
                  disabled={!prevDoctorId}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                    prevDoctorId 
                      ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md' 
                      : 'bg-white/5 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => nextDoctorId && navigate(`/doctor-profile-premium/${nextDoctorId}`)}
                  disabled={!nextDoctorId}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                    nextDoctorId 
                      ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md' 
                      : 'bg-white/5 text-white/40 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Enhanced Doctor Image & Quick Stats */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-56 h-56 rounded-3xl object-cover shadow-2xl border-4 border-white/20 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-800 text-xl">{doctor.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{doctor.reviews} reviews</p>
                </div>
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg p-3 text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-bold">Premium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Doctor Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-5xl font-bold">{doctor.name}</h1>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          isLiked 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white'
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-colors">
                        <MessageSquare className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={handleStartVideoCall}
                        className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg"
                      >
                        <Video className="w-5 h-5" />
                        <span className="hidden sm:inline">Video Call</span>
                      </button>
                      <button 
                        onClick={handleStartVoiceCall}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="hidden sm:inline">Voice Call</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-2xl text-blue-100 mb-2">{doctor.specialty}</p>
                  <p className="text-blue-200 text-lg">{doctor.subSpecialty}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-green-100 font-medium">Verified Doctor</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <Award className="w-7 h-7 text-yellow-300 mb-3" />
                  <p className="text-sm text-blue-100">Experience</p>
                  <p className="text-3xl font-bold">{doctor.experience} years</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <Users className="w-7 h-7 text-green-300 mb-3" />
                  <p className="text-sm text-blue-100">Patients</p>
                  <p className="text-3xl font-bold">{doctor.patientsServed}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <ThumbsUp className="w-7 h-7 text-cyan-300 mb-3" />
                  <p className="text-sm text-blue-100">Success Rate</p>
                  <p className="text-3xl font-bold">{doctor.successRate}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <Shield className="w-7 h-7 text-purple-300 mb-3" />
                  <p className="text-sm text-blue-100">Verified</p>
                  <p className="text-xl font-bold mt-1">Certified</p>
                </div>
              </div>

              {/* Enhanced Contact Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                  <Hospital className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-blue-200">Facility</p>
                    <p className="font-medium">{doctor.facility}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-blue-200">Location</p>
                    <p className="font-medium">{doctor.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-blue-200">Contact</p>
                    <p className="font-medium">{doctor.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-8">
              <div className="flex border-b border-gray-100">
                {[
                  { id: 'about', label: 'About', icon: Stethoscope },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'services', label: 'Services', icon: FileText },
                  { id: 'reviews', label: 'Reviews', icon: Star }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                      activeTab === id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                    About Dr. {doctor.name.split(' ')[1]}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">{doctor.about}</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Medical Philosophy
                    </h3>
                    <p className="text-gray-700 italic">"{doctor.philosophy}"</p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-600" />
                    Achievements & Recognition
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {doctor.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-yellow-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Publications */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    Recent Publications
                  </h2>
                  <div className="space-y-4">
                    {doctor.publications.map((publication, idx) => (
                      <div key={idx} className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-gray-700 font-medium">{publication}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-8">
                {/* Education */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Education & Training
                  </h2>
                  <div className="space-y-6">
                    {doctor.education.map((edu, idx) => (
                      <div key={idx} className="flex gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{edu.degree}</h3>
                          <p className="text-lg text-blue-600 font-semibold mb-1">{edu.institution}</p>
                          <p className="text-gray-600 mb-2">{edu.year}</p>
                          {edu.honors && (
                            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                              <Award className="w-4 h-4" />
                              {edu.honors}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Certifications & Credentials
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {doctor.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Services Offered
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {doctor.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <ChevronRight className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-semibold text-lg">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    Patient Reviews
                  </h2>
                  <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{doctor.rating}</span>
                    <span className="text-gray-600">({doctor.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {patientReviews.map((review) => (
                    <div key={review.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {review.patient[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-semibold text-gray-800 text-lg">{review.patient}</p>
                              {review.verified && (
                                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">({review.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">Helpful ({review.helpful})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 py-4 border-2 border-blue-200 text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  View All {doctor.reviews} Reviews
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Enhanced Booking */}
          <div className="space-y-6">
            {/* Enhanced Appointment Booking Card */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 p-8 sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Book Appointment</h3>
                <p className="text-gray-600">Choose your preferred consultation type</p>
              </div>

              {/* Enhanced Consultation Fees */}
              <div className="space-y-4 mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Consultation Fees
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Hospital className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">In-Person</p>
                        <p className="text-xs text-gray-500">Office visit</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">${doctor.consultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">Video Call</p>
                        <p className="text-xs text-gray-500">Remote consultation</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">${doctor.videoConsultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">Voice Call</p>
                        <p className="text-xs text-gray-500">Audio consultation</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">${doctor.voiceConsultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">Follow-up</p>
                        <p className="text-xs text-gray-500">Return visit</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">${doctor.followUpFee}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Appointment Type */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-4">Appointment Type</label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setAppointmentType('in-person')}
                    className={`p-4 rounded-2xl border-2 font-semibold transition-all ${
                      appointmentType === 'in-person'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Hospital className="w-6 h-6" />
                        <div className="text-left">
                          <p className="font-semibold">In-Person Visit</p>
                          <p className="text-sm opacity-75">Come to our office</p>
                        </div>
                      </div>
                      {appointmentType === 'in-person' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                    </div>
                  </button>
                  <button
                    onClick={() => setAppointmentType('video')}
                    className={`p-4 rounded-2xl border-2 font-semibold transition-all ${
                      appointmentType === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="w-6 h-6" />
                        <div className="text-left">
                          <p className="font-semibold">Video Consultation</p>
                          <p className="text-sm opacity-75">Connect online</p>
                        </div>
                      </div>
                      {appointmentType === 'video' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                    </div>
                  </button>
                  <button
                    onClick={() => setAppointmentType('voice')}
                    className={`p-4 rounded-2xl border-2 font-semibold transition-all ${
                      appointmentType === 'voice'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="w-6 h-6" />
                        <div className="text-left">
                          <p className="font-semibold">Voice Call</p>
                          <p className="text-sm opacity-75">Audio consultation</p>
                        </div>
                      </div>
                      {appointmentType === 'voice' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                    </div>
                  </button>
                  
                  {/* Quick Video Call Button */}
                  <button
                    onClick={handleStartVideoCall}
                    className="w-full p-4 rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 font-semibold transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Video className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-green-700">Start Video Call Now</p>
                          <p className="text-sm text-green-600">Instant consultation</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-green-600" />
                    </div>
                  </button>

                  {/* Quick Voice Call Button */}
                  <button
                    onClick={handleStartVoiceCall}
                    className="w-full p-4 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 font-semibold transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-blue-700">Start Voice Call Now</p>
                          <p className="text-sm text-blue-600">Audio consultation</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Enhanced Date Selection */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                />
              </div>

              {/* Enhanced Time Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Available Times</label>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {getTodaySlots().length > 0 ? getTodaySlots().map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                        selectedTime === time
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {time}
                    </button>
                  )) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No available slots today</p>
                      <p className="text-sm">Please select a different date</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Call Button */}
              <button
                onClick={handleStartVideoCall}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all duration-300 flex items-center justify-center gap-3 text-lg mb-4"
              >
                <Video className="w-6 h-6" />
                Start Video Call Now
              </button>

              {/* Voice Call Button */}
              <button
                onClick={handleStartVoiceCall}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-3 text-lg mb-4"
              >
                <Phone className="w-6 h-6" />
                Start Voice Call Now
              </button>

              <button
                onClick={handleBookAppointment}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-5 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
              >
                <Calendar className="w-6 h-6" />
                Book Appointment
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Free cancellation up to 24 hours before
              </p>
            </div>

            {/* Enhanced Additional Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Languages Spoken
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang, idx) => (
                  <span key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Insurance Accepted
              </h3>
              <div className="space-y-3">
                {doctor.insuranceAccepted.slice(0, 4).map((insurance, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{insurance}</span>
                  </div>
                ))}
                <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 mt-3 flex items-center gap-1">
                  View all {doctor.insuranceAccepted.length} insurance plans
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Confirm Appointment</h3>
              <p className="text-gray-600">Please review your appointment details</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Doctor</span>
                <span className="font-bold text-gray-800 text-lg">{doctor.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Specialty</span>
                <span className="font-semibold text-gray-800">{doctor.specialty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Date</span>
                <span className="font-semibold text-gray-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Time</span>
                <span className="font-semibold text-gray-800">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Type</span>
                <span className="font-semibold text-gray-800">
                  {appointmentType === 'video' ? 'Video Consultation' : 
                   appointmentType === 'voice' ? 'Voice Call' : 'In-Person Visit'}
                </span>
              </div>
              <div className="border-t border-blue-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold text-lg">Total Fee</span>
                  <span className="font-bold text-gray-800 text-2xl">
                    ${appointmentType === 'video' ? doctor.videoConsultationFee :
                       appointmentType === 'voice' ? doctor.voiceConsultationFee : doctor.consultationFee}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmBooking}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold transition-all text-lg shadow-lg"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-8 py-4 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}