import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { canAccessRoute, getDefaultRouteForRole } from '../config/roles';

export default function RoleGuard({ children }) {
  const { user } = useApp();
  const location = useLocation();
  const role = user.dashboardRole || 'developer';
  const allowed = canAccessRoute(role, location.pathname);

  if (!allowed) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
}
