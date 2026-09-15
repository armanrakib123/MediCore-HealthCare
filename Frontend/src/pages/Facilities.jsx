import React from 'react'
import { Link } from 'react-router-dom'
import { FaHospital, FaClinicMedical, FaAmbulance, FaMicroscope } from 'react-icons/fa'
import './Facilities.css'

export default function Facilities() {
  return (
    <div className="facilities-page">
      <header className="facilities-hero">
        <div className="facilities-hero-content">
          <div className="hero-label">Our Facilities</div>
          <h1>State-of-the-Art Medical <span className="highlight">Centers</span></h1>
          <p className="lead">
            Discover our world-class medical facilities equipped with advanced technology and staffed by dedicated healthcare professionals committed to your well-being.
          </p>
        </div>
        <div className="facilities-hero-image" aria-hidden>
          <div className="image-container">
            <img
              src="https://i.pinimg.com/1200x/8b/5c/8a/8b5c8a8b5c8a8b5c8a8b5c8a8b5c8a.jpg"
              alt="Medical facility"
              className="hero-image"
            />
          </div>
        </div>
      </header>

      <section className="facilities-section">
        <div className="container">
          <h2>Our Medical Facilities</h2>
          <div className="facilities-grid">
            <div className="facility-card">
              <FaHospital className="facility-icon" />
              <h3>General Hospital</h3>
              <p>Comprehensive healthcare services with 24/7 emergency care, advanced surgical suites, and specialized departments.</p>
            </div>
            <div className="facility-card">
              <FaClinicMedical className="facility-icon" />
              <h3>Specialty Clinics</h3>
              <p>Dedicated clinics for cardiology, oncology, neurology, and other specialized medical fields.</p>
            </div>
            <div className="facility-card">
              <FaAmbulance className="facility-icon" />
              <h3>Emergency Services</h3>
              <p>Rapid response emergency care with advanced life support and trauma centers available around the clock.</p>
            </div>
            <div className="facility-card">
              <FaMicroscope className="facility-icon" />
              <h3>Diagnostic Center</h3>
              <p>State-of-the-art diagnostic imaging and laboratory services for accurate and timely medical testing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section container">
        <h2>Facility Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h4>Advanced Technology</h4>
            <p>Latest medical equipment and digital health records for optimal patient care.</p>
          </div>
          <div className="feature-item">
            <h4>Patient-Centered Design</h4>
            <p>Comfortable, accessible facilities designed with patient comfort and convenience in mind.</p>
          </div>
          <div className="feature-item">
            <h4>Expert Medical Staff</h4>
            <p>Highly qualified physicians, nurses, and support staff committed to excellence.</p>
          </div>
          <div className="feature-item">
            <h4>Integrated Care</h4>
            <p>Seamless coordination between departments for comprehensive treatment plans.</p>
          </div>
        </div>
      </section>

      <section className="facilities-cta">
        <div className="container">
          <h2>Experience Quality Healthcare</h2>
          <p>Visit our facilities or connect with our healthcare professionals today.</p>
          <div className="hero-ctas">
            <Link to="/doctors" className="btn primary">Find a Doctor</Link>
            <Link to="/contact" className="btn primary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
