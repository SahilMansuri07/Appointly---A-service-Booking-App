import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../../redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import { logout } from '../../redux/slices/authSlice';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
//   { to: '/admin/job/add',    label: 'Add Job',    icon: '📅' },
//   { to: '/admin/application',   label: 'Applications',   icon: '📋' },
  { to: '/admin/services',   label: 'Services',   icon: '📋' },
  { to: '/admin/profile',     label: 'Profile',     icon: '👥' },
  { to: '/admin/appointments',   label: 'Appointments',   icon: '📅' },
];

export default function AdminLayout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <aside
        className="theme-sidebar d-flex flex-column"
        style={{ width: 240, minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100 }}
      >
        {/* Brand */}
        <div className="p-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h6 className="fw-bold mb-0" style={{ color: '#f59e0b' }}> Admin DashBoard </h6>
          <small style={{ color: 'var(--text-sidebar)' }}>{user?.name}</small>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow-1 p-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded mb-1 text-decoration-none transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white-50'
                }`
              }
              style={({ isActive }) => isActive ? {} : {
                color: 'var(--text-sidebar)',
              }}
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer: theme toggle + logout */}
        <div className="p-3 d-flex flex-column gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          padding: '24px',
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          color: 'var(--text-primary)',
          transition: 'background-color 0.25s ease',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
