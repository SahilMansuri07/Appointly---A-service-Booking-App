import React from 'react'
import { FiEdit, FiTrash, FiClock } from 'react-icons/fi';
import { formatTime12h } from '../../helper';


export default function ServiceList({service, handleEditModel}) {
  return (
    <tr key={service.id}>
                        <td className="px-4 py-3">
                          <div className="fw-semibold">{service.service_name}</div>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {service.description ? (service.description.length > 50 ? `${service.description.substring(0, 50)}...` : service.description) : '—'}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          <span className="d-inline-flex align-items-center gap-1"><FiClock size={14} /> {service.duration_minutes} min</span>
                        </td>
                        <td className="px-4 py-3 fw-medium">
                          ₹{service.price}
                        </td>
                       <td className="px-4 py-3 text-muted small" style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                          {service.working_hours?.length > 0
                            ? service.working_hours
                                .map(wh => `${wh.day?.substring(0, 3).toUpperCase()}: ${formatTime12h(wh.start_time?.substring(0, 5))} - ${formatTime12h(wh.end_time?.substring(0, 5))}`)
                                .join('\n')
                            : '—'}
                        </td>   
                        <td className="px-4 py-3">
                          <button className="btn btn-sm btn-link text-decoration-none text-primary fw-medium ms-auto" onClick={() => handleEditModel(service)}>
                            <FiEdit size={18} />
                          </button>
                        </td>
                      </tr>
  )
}
