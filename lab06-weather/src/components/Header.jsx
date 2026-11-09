import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to={ROUTES.dashboard} className="app-header__brand">Погода</Link>
        <div className="app-header__user">
          <span>
            Ви увійшли як <strong>{user}</strong>
          </span>
          <button type="button" className="button button--quiet" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </div>
    </header>
  );
}
