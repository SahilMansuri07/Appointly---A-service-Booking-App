import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";

import { FiBriefcase, FiUsers, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { adminDashboardApi } from "../../api/serviceBookingApi";
import DashboardCards from "../../components/users/DashboardCards";


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const result = await adminDashboardApi();
        console.log('Admin dashboard data:', result.data);
        if (result?.code === 1) {
          console.log('Admin dashboard data loaded successfully:', result.data);
          setStats(result.data);
        } else {
          setError(result?.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError(err?.response?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error || !stats) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold">{error || 'No data found'}</h2>
      </div>
    );
  }

  const cards = [
    {
      label: 'Upcoming Appointments',
      value: stats.upcomingAppointmentsData,
      icon: <FiBriefcase size={22} />,
      bg: '#eef2ff',
      color: '#4f46e5',
    },
    {
      label: 'Total Appoinments',
      value: stats.totalAppointments,
      icon: <FiUsers size={22} />,
      bg: '#e6f1fb',
      color: '#185fa5',
    },
    {
      label: 'Total Services',
      value: stats.totalServices,
      icon: <FiCheckCircle size={22} />,
      bg: '#e6f6ec',
      color: '#15803d',
    },
    {
      label: 'Past Appoinments',
      value: stats.totalPastAppointments,
      icon: <FiXCircle size={22} />,
      bg: '#e0ffc1',
      color: '#7ff500',
    },
  ];

  return (
    <div className="page-shell container py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-muted mb-0">Overview of jobs and applications across the platform.</p>
      </div>
      <DashboardCards cards={cards} />
      <div className="my-4"></div>
       <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow-sm border-0 rounded-3 h-100">
                  <div className="card-body p-4 text-center d-flex flex-column justify-content-center">
                    <div className="mb-3 text-primary">
                      <span className="fs-1 fw-bold opacity-75">🏢</span>
                    </div>
                    <h5 className="fw-bold mb-2">Explore Your Services</h5>
                    <p className="text-muted mb-4">Find jobs that match your skills and apply in just a few clicks.</p>
                    <div>
                      <Link to="/admin/services" className="btn btn-primary px-4 py-2 fw-semibold rounded-pill">
                        Browse Services
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
      
              <div className="col-md-6">
                <div className="card shadow-sm border-0 rounded-3 h-100">
                  <div className="card-body p-4 text-center d-flex flex-column justify-content-center">
                    <div className="mb-3 text-success">
                      <span className="fs-1 fw-bold opacity-75">📄</span>
                    </div>
                    <h5 className="fw-bold mb-2">Track Your Appointments</h5>
                    <p className="text-muted mb-4">View the status of appointments you've scheduled and stay updated.</p>
                    <div>
                      <Link to="/admin/appointments" className="btn btn-outline-success px-4 py-2 fw-semibold rounded-pill">
                        My Appointments
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
}