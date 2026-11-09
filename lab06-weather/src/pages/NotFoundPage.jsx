import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes.js';

export default function NotFoundPage() {
  return (
    <main className="page-message">
      <h1 className="page-message__title">Такої сторінки немає</h1>
      <p className="page-message__text">Перевірте адресу або поверніться до прогнозу.</p>
      <Link to={ROUTES.dashboard} className="button button--primary">
        Відкрити прогноз
      </Link>
    </main>
  );
}
