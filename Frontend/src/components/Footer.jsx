import React from 'react'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeartbeat
} from 'react-icons/fa'
import './Footer.css'
import { NavLink} from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">

        {/* About */}
        <div className="footer-section footer-about">
          <div className="footer-brand">
            <NavLink
              to="/"
              className="brand"
            >
              <span className="brand-icon">
                <FaHeartbeat />
              </span>

              <span className="brand-text">
                Medi<span>Core</span>
              </span>
            </NavLink>
          </div>

          <p>
            Your trusted healthcare partner, providing reliable healthcare
            services and connecting patients with quality medical care.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>

          <ul>
            <li>
              <a href="/about">
                <span>→</span> About
              </a>
            </li>

            <li>
              <a href="/contact">
                <span>→</span> Contact
              </a>
            </li>

            <li>
              <a href="/doctors">
                <span>→</span> Doctors
              </a>
            </li>

            <li>
              <a href="/pharmacy">
                <span>→</span> Pharmacy
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Our Services</h4>

          <ul>
            <li>
              <a href="/doctors">
                <span>→</span> Find a Doctor
              </a>
            </li>

            <li>
              <a href="/appointments">
                <span>→</span> Appointments
              </a>
            </li>

            <li>
              <a href="/pharmacy">
                <span>→</span> Online Pharmacy
              </a>
            </li>

            <li>
              <a href="/facilities">
                <span>→</span> Healthcare Facilities
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h4>Connect With Us</h4>

          <p className="social-text">
            Follow MediCore for healthcare updates and news.
          </p>

          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} <strong>MediCore</strong>.
          All rights reserved.
        </p>

        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <span>•</span>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  )
}