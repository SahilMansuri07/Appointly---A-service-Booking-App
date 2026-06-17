import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import Loader from '../components/common/Loader';

import AdminLayout from '../layouts/admin/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';
import { PublicRoute } from './PublicRoutes';
import NotFound from '../components/common/NotFound';

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const SignUp = lazy(() => import('../pages/admin/SignUp'));
const Login = lazy(() => import('../pages/admin/Login'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));
const ServiceManagement = lazy(() => import('../pages/admin/ServiceManagement'));
const BookService = lazy(() => import('../pages/user/BookService'));
const ListAppointments = lazy(() => import('../pages/admin/ListAppointments'));
const ServiceList = lazy(() => import('../pages/user/ServiceList'));



// Redirects logged-in users from /events to their dashboard
function ServiceGate({ isAuthenticated, role }) {

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/list'} replace />;
  }
  
  return <ServiceList />;

}

export default function AppRoutes() {

  const { isAuthenticated, role } = useSelector(s => s.auth);

  return (
    <Suspense fallback={<Loader fullScreen = {true} />}>
      <Routes>
        {/* ── Root redirect ── */}
        <Route element={<PublicLayout />}>
          <Route index element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<ServiceList />} />
          <Route path="/service/:id" element={<BookService />} />

          <Route element={<PublicRoute />}>
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>

        {/* ── Admin (protected) ── */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard   />} />
          <Route path="services" element={<ServiceManagement />} />
          {/* <Route path="users" element={<AdminUsers />} /> */}
          <Route path="appointments" element={<ListAppointments   />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
