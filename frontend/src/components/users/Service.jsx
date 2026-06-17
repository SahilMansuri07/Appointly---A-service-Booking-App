import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Service({ service }) {
  const navigate = useNavigate()

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '320px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      fontFamily: 'sans-serif',
      backgroundColor: '#fff'
    }}>
      <h3 style={{ margin: '0 0 4px' }}>{service.service_name}</h3>
      <h6 style={{ margin: '0 0 12px', color: '#666', fontWeight: 'normal' }}>
        By: {service.admin_name}
      </h6>
      <p style={{ margin: '0 0 12px', color: '#333' }}>{service.description}</p>
      <span style={{ display: 'block', marginBottom: '8px', color: '#555' }}>
        Duration: {service.duration_minutes} minutes
      </span>
      <p style={{ margin: '0 0 12px', fontWeight: 'bold' }}>Price: ${service.price}</p>
      <button style={{
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        fontSize: '14px'
      }} onClick={() => navigate(`/service/${service.id}`)}>
        Book Now
      </button>
    </div>
  )
}