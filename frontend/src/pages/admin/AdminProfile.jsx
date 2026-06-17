import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { FiUser, FiMail, FiPhone, FiEdit2 } from 'react-icons/fi';
import UserProfileModal from './UserProfileModal ';
import { getAdminProfileApi, updateProfileApi } from '../../api/serviceBookingApi';

function InfoRow({ icon, label, value }) {
  return (
    <div className="d-flex align-items-start gap-3 py-3 border-bottom">
      <div
        className="d-flex align-items-center justify-content-center rounded"
        style={{ width: 36, height: 36, background: '#eef2ff', color: '#4f46e5', flexShrink: 0 }}
      >
        {icon}
      </div>
      <div>
        <div className="text-muted small mb-1">{label}</div>
        <div className="fw-semibold">{value || '—'}</div>
      </div>
    </div>
  );
}

export default function AdminProfile() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await getAdminProfileApi();
            if (res?.code === 1) {
                // user array or object?
                const userData = Array.isArray(res.data) ? res.data[0] : res.data;
                setUser(userData || {});
            } else {
                toast.error(res?.message || 'Failed to load profile');
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message || err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveProfile = async (formData) => {
        try {
            const res = await updateProfileApi(formData);
            if (res?.code === 1) {
                toast.success('Profile updated successfully');
                setShowEditModal(false);
                fetchProfile(); // refresh data
            } else {
                toast.error(res?.message || 'Failed to update profile');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || 'Failed to update profile');
        }
    };

    if (loading) return <Loader />;
    if (!user) return <div className="container py-5 text-center"><h2 className="fw-bold">Profile not found</h2></div>;

    return (
        <div className="page-shell container py-4">
            <div className="mb-3">
                <h2 className="fw-bold mb-1">Admin Profile</h2>
                <p className="text-muted mb-0">View and manage your admin account information.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    {/* Header */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom mb-2">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                style={{ width: 56, height: 56, background: '#eef2ff', color: '#4f46e5', fontSize: '1.25rem' }}
                            >
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                                <h4 className="fw-bold mb-1">{user?.name || 'Admin User'}</h4>
                                <div className="text-muted small">{user?.email || '—'}</div>
                            </div>
                        </div>

                        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowEditModal(true)}>
                            <FiEdit2 size={16} />
                            Edit Profile
                        </button>
                    </div>

                    {/* Info rows */}
                    <InfoRow icon={<FiUser size={18} />} label="Full Name" value={user?.name} />
                    <InfoRow icon={<FiMail size={18} />} label="Email" value={user?.email} />
                    <InfoRow
                        icon={<FiPhone size={18} />}
                        label="Mobile Number"
                        value={user?.mobile_number ? `${user.country_code || ''} ${user.mobile_number}` : null}
                    />
                </div>
            </div>

            {showEditModal && (
                <UserProfileModal
                    user={user}
                    isEdit={true}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );
}
