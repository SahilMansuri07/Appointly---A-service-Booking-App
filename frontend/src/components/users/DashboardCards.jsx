import React from 'react'

export default function DashboardCards({ cards }) {

  return (
    
      <div className="row g-3">
        {cards.map((card) => (
          <div key={card.label} className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 d-flex flex-column gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{ width: 48, height: 48, background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="fw-bold mb-1">{card.value}</h3>
                  <p className="text-muted small mb-0">{card.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  )
}
