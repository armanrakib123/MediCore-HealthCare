import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Facilities from './pages/Facilities'
import Doctors from './pages/Doctors'
import Pharmacy from './pages/Pharmacy'
import Login from './pages/Login'
import AuthPage from './pages/AuthPage'
import PatientDashboard from './pages/PatientDashboard'
import PharmacyDashboard from './pages/PharmacyDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AppointmentBookingPage from './pages/AppointmentBookingPage'
import DoctorProfile from './pages/DoctorProfile'
import DoctorProfileDemo from './pages/DoctorProfileDemo'
import VideoCallPage from './pages/VideoCallPage'
import CallButtonPage from './pages/CallButtonPage'
import TestPage from './pages/TestPage'
import DoctorManagement from './pages/DoctorManagement'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="">
        <Header />

        <main className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/appointment-booking" element={<AppointmentBookingPage />} />
            <Route path="/doctor-profile/:doctorId" element={<DoctorProfile />} />
            <Route path="/doctor-profile-demo" element={<DoctorProfileDemo />} />
            <Route path="/video-call" element={<VideoCallPage />} />
            <Route path="/video-call/:doctorId" element={<VideoCallPage />} />
            <Route path="/call-selection" element={<CallButtonPage />} />
            <Route path="/call-selection/:doctorId" element={<CallButtonPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/admin/doctors" element={<ProtectedRoute requiredRole="doctor_admin"><DoctorManagement /></ProtectedRoute>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
