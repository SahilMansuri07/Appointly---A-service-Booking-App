// pages/user/MyApplications.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiFileText } from 'react-icons/fi';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';

import { useNavigate } from 'react-router-dom';
import { fetchMyAppointments , updateAppointmentStatus } from '../../redux/slices/appoinmentsSlice';
import { updateAppointmentStatusApi } from '../../api/serviceBookingApi';
import { StatusBadge } from '../../helper';

  
export default function ListAppointments() {
const dispatch = useDispatch();
const navigate = useNavigate();
const [page, setPage] = useState(1);
const [status , setStatus] = useState("");

const handleStatusUpdate = async (appointment_id , status) => {
    console.log(`Updating appointment ${appointment_id} to status: ${status}`);
    const response = await updateAppointmentStatusApi({ appointment_id, status });
    // dispatch(updateAppointmentStatus({ id, status: newStatus }));
    dispatch(fetchMyAppointments({ page, limit: 10, status }));
    
};

const { appointmentsList: appointments, loading, error, pagination } = useSelector(
    (state) => state.appointments
);
// console.log("updateLoading", updateLoading , "updateId", updateId);
useEffect(() => {
    dispatch(fetchMyAppointments({ page, limit: 10 , status }));
}, [dispatch, page , status]);

// console.log("applications",applications , pagination);   
const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
// console.log("appointments", appointments, pagination);

const counts = {
    all: pagination?.total || appointments?.length || 0,
    pending: appointments?.filter((a) => a.status === 'pending').length || 0,
    completed: appointments?.filter((a) => a.status === 'completed').length || 0,
    cancelled: appointments?.filter((a) => a.status === 'cancelled').length || 0,
};

return (
    <div className="container py-4">
        <div className="mb-3">
            <h2 className="fw-bold mb-1">My Appointments</h2>
            <p className="text-muted mb-0">Track the status of all your appointments.</p>
        </div>

        {loading ? (
            <Loader fullScreen={false} />
        ) : error ? (
            <div className="alert alert-danger">{error}</div>
        ) : (
            <>
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr className="text-muted text-uppercase" style={{ fontSize: '0.7rem', background: '#fafafa' }}>
                                    <th className="px-4 py-3 border-0">Service Name</th>
                                    <th className="px-4 py-3 border-0">Applied Date</th>
                                    <th className="px-4 py-3 border-0">Time Slot</th>
                                    <th className="px-4 py-3 border-0">Status</th>
                                    <th className="px-4 py-3 border-0 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments?.map((app) => (
                <tr key={app.id}>
                    <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                        <div
                        className="d-flex align-items-center justify-content-center rounded"
                        style={{ width: 36, height: 36, background: '#eef2ff', flexShrink: 0 }}
                        >
                        <FiFileText style={{ color: '#4f46e5' }} />
                        </div>
                        <div>
                        <div className="fw-semibold">{app.service_name}</div>
                        <div className="text-muted small">
                                {app.user_name}
                        </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-4 py-3 text-muted fw-medium">
                    {app.appointment_date}
                    </td>
                    <td className="px-4 py-3 text-muted fw-medium">
                    {app.start_time} - {app.end_time}
                    </td>
                    <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                    </td>
                    {
                        app.status === "pending"  ?  <td className="px-4 py-3 text-end">
                <button className="btn btn-sm btn-outline-primary"  onClick={() => handleStatusUpdate(Number(app.id) , 'completed')}>Accept Appointment</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleStatusUpdate(Number(app.id), 'cancelled')}>Reject Appointment</button>
                    </td>  : <td className="px-4 py-3 text-end">
                       No Action Needed
                    </td>
                    }
                   
                </tr>
                ))}
                            </tbody>
                        </table>
                    </div>

                    {appointments?.length === 0 && (
                        <div className="text-center text-muted py-5">You haven't applied for any jobs yet.</div>
                    )}

                    {appointments?.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
                            <span className="text-muted small">
                                Showing {appointments.length} of {pagination?.total || appointments.length} appointments
                            </span>
                            <Pagination
                                page={page}
                                totalPages={pagination?.totalPages || pagination?.total_pages || 1}
                                total={pagination?.total || 0}
                                label="appointments"
                                onPageChange={handlePageChange}
                                align="end"
                                hideLabel
                            />
                        </div>
                    )}
                </div>
            </>
        )}
    </div>
);
}


