import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { ROUTES } from './config/routes.js';

/**
 * <Routes> рендерить перший маршрут, що збігся з адресою
 * (аналог <Switch> з React Router v4 із лекції).
 */
export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.dashboard} replace />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route
        path={ROUTES.dashboard}
        element={(
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
