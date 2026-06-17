// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// import { toast } from 'react-hot-toast';
// import { logout } from '../../redux/slices/authSlice';
// import ThemeToggle from './ThemeToggle';
// import { FiBell, FiChevronDown, FiMoon, FiSearch, FiUser } from 'react-icons/fi';

// const topNavLinks = [
//     { to: '/user/jobs', label: 'Find Jobs' },
//     { to: '/user/my-applications', label: 'My Applications' },
//     { to: '/user/dashboard', label: 'Dashboard' },
//     { to: '/user/profile', label: 'Profile' },
// ];

// export default function NavBar() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { user, isAuthenticated } = useSelector(s => s.auth);

//     const handleLogout = () => {
//         dispatch(logout());
//         toast.success('Logged out');
//         navigate('/login');
//     };

//     return (
//         <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom border-3 border-primary shadow-sm">
//             <div className="container-fluid px-3 px-lg-4 py-2">
//                 <div className="d-flex align-items-center gap-3 flex-wrap">
//                     <Link className="navbar-brand fw-bold fs-3 text-primary lh-1 me-0" to="/user/dashboard">
//                         Linked Out
//                     </Link>

//                     <div className="d-flex align-items-center gap-1 flex-wrap">
//                         {topNavLinks.map((item) => (
//                             <NavLink
//                                 key={item.to}
//                                 to={item.to}
//                                 className={({ isActive }) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'bg-primary text-white' : 'text-secondary'}`}
//                             >
//                                 {item.label}
//                             </NavLink>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
//                     <button type="button" className="btn btn-light border rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }} aria-label="Search jobs">
//                         <FiSearch />
//                     </button>
//                     <button type="button" className="btn btn-light border rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }} aria-label="Notifications">
//                         <FiBell />
//                     </button>
//                     <button type="button" className="btn btn-light border rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }} aria-label="Theme">
//                         <FiMoon />
//                     </button>
//                     <ThemeToggle />

//                     {isAuthenticated ? (
//                         <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill border bg-light">
//                             <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold" style={{ width: 30, height: 30, fontSize: '0.8rem' }}>
//                                 {user?.name?.[0] || <FiUser />}
//                             </span>
//                             <span className="fw-semibold text-dark small d-none d-md-inline">{user?.name || 'User'}</span>
//                             <FiChevronDown />
//                             <button type="button" className="btn btn-link text-decoration-none text-danger fw-semibold p-0 ms-1" onClick={handleLogout}>
//                                 Logout
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="d-flex align-items-center gap-2">
//                             <Link to="/login" className="btn btn-outline-secondary rounded-pill px-3">Login</Link>
//                             <Link to="/signup" className="btn btn-primary rounded-pill px-3 fw-semibold">Sign up</Link>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// }