import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-md-3">
            <h5 className="mb-3">
              <span style={{ color: '#4CAF50', fontSize: '20px' }}>📅</span> ServiceSlot
            </h5>
            <p className="text-muted small">
              Book your perfect appointment with ease. Find services, select slots, and manage your schedule effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h6 className="mb-3 fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  onClick={() => navigate('/list')}
                  style={{ cursor: 'pointer', color: '#adb5bd', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.target.style.color = '#4CAF50')}
                  onMouseLeave={(e) => (e.target.style.color = '#adb5bd')}
                >
                  Browse Services
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3">
            <h6 className="mb-3 fw-bold">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="mailto:support@serviceslot.com"
                  style={{ cursor: 'pointer', color: '#adb5bd', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.target.style.color = '#4CAF50')}
                  onMouseLeave={(e) => (e.target.style.color = '#adb5bd')}
                >
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <span style={{ color: '#adb5bd' }}>Privacy Policy</span>
              </li>
              <li className="mb-2">
                <span style={{ color: '#adb5bd' }}>Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3">
            <h6 className="mb-3 fw-bold">Contact</h6>
            <p className="text-muted small mb-2">
              <strong>Email:</strong> info@serviceslot.com
            </p>
            <p className="text-muted small mb-2">
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p className="text-muted small">
              <strong>Hours:</strong> 9 AM - 6 PM EST
            </p>
          </div>
        </div>

        <hr className="bg-secondary my-4" />

        <div className="row">
          <div className="col-md-6">
            <p className="text-muted small mb-0">
              © {currentYear} ServiceSlot. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted small mb-0">
              Built with <span style={{ color: '#4CAF50' }}>❤</span> for better scheduling
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
