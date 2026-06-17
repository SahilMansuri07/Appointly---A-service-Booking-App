import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export function PublicRoute() {
  const { isAuthenticated } = useSelector(s => s.auth);
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
}
