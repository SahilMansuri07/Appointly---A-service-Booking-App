import { FiUser, FiMail, FiPhone, FiShield, FiCalendar, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { StatusBadge } from '../../helper';



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

export default function UserProfileModal({ user, isEdit = false, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_number: '',
        country_code: '+91'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobile_number: user.mobile_number || '',
                country_code: user.country_code || '+91'
            });
        }
    }, [user]);

    if (!user) return null;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (onSave) {
            setSubmitting(true);
            await onSave(formData);
            setSubmitting(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">{isEdit ? 'Edit Profile' : 'User Profile'}</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={submitting} />
                    </div>

                    <div className="modal-body">
                        {/* Header */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom mb-2">
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                    style={{ width: 56, height: 56, background: '#eef2ff', color: '#4f46e5', fontSize: '1.25rem' }}
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-1">{user.name || 'Unnamed User'}</h4>
                                    <div className="text-muted small">{user.email || '—'}</div>
                                </div>
                            </div>
                            <StatusBadge isActive={user.is_active} />
                        </div>

                        {/* Info rows or Form */}
                        {isEdit ? (
                            <form id="editProfileForm" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Full Name</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Mobile Number</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" style={{ maxWidth: '80px' }} name="country_code" value={formData.country_code} onChange={handleChange} placeholder="+91" />
                                        <input type="text" className="form-control" name="mobile_number" value={formData.mobile_number} onChange={handleChange} />
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <>
                                <InfoRow icon={<FiUser size={18} />} label="Full Name" value={user.name} />
                                <InfoRow icon={<FiMail size={18} />} label="Email" value={user.email} />
                                <InfoRow
                                    icon={<FiPhone size={18} />}
                                    label="Mobile Number"
                                    value={user.mobile_number ? `${user.country_code || ''} ${user.mobile_number}` : null}
                                />
                                <InfoRow
                                    icon={<FiCalendar size={18} />}
                                    label="Joined On"
                                    value={
                                        user.registration_date
                                            ? new Date(user.registration_date).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })
                                            : null
                                    }
                                />
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                            Close
                        </button>
                        {isEdit && (
                            <button type="submit" form="editProfileForm" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}