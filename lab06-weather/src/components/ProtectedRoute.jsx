import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';

/**
 * Пропускає на сторінку лише авторизованих користувачів.
 * Інших перенаправляє на /login і запам’ятовує, куди вони хотіли потрапити.
 * (У React Router v4 з лекції це був <Redirect>, у v6+ — <Navigate>.)
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }
  return children;
}
