import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useSelector(s => s.auth)

  return (
    <header className="bg-light border-bottom">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <a className="navbar-brand fw-bold" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span style={{ color: '#4CAF50', fontSize: '24px' }}>📅</span> ServiceSlot
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/list')} style={{ cursor: 'pointer' }}>
                  Services
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
