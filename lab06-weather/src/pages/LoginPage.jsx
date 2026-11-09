import { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import TextField from '../components/TextField.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';
import { hasErrors, validateLoginForm } from '../utils/validation.js';
import './LoginPage.css';

const INITIAL_VALUES = { login: '', password: '', remember: false };
const WRONG_CREDENTIALS = 'Неправильний логін або пароль. Перевірте дані й спробуйте ще раз.';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Куди повернути користувача після входу (передає ProtectedRoute).
  const redirectTo = location.state?.from ?? ROUTES.dashboard;
  const wasRedirected = Boolean(location.state?.from);

  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  // Уже авторизований користувач не бачить форму повторно.
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const errors = validateLoginForm(values);
  // Помилку поля показуємо після того, як користувач з нього пішов або натиснув «Увійти».
  const errorFor = (field) => (touched[field] || submitAttempted ? errors[field] : undefined);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setAuthError('');
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // без перезавантаження сторінки
    setSubmitAttempted(true);

    if (hasErrors(errors)) {
      (errors.login ? loginRef : passwordRef).current?.focus();
      return;
    }

    const success = login(values.login, values.password, { remember: values.remember });
    if (!success) {
      setAuthError(WRONG_CREDENTIALS);
      passwordRef.current?.select();
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="login">
      <section className="login__panel" aria-labelledby="login-title">
        <h1 id="login-title" className="login__title">Погода</h1>
        <p className="login__lead">
          {wasRedirected
            ? 'Увійдіть, щоб переглянути прогноз.'
            : 'Увійдіть, щоб побачити прогноз на 5 днів.'}
        </p>

        <form className="login__form" noValidate onSubmit={handleSubmit}>
          <TextField
            id="login"
            name="login"
            label="Логін"
            hint="Ім’я латиницею та номер курсу, наприклад mark5"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={values.login}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('login')}
            ref={loginRef}
          />

          <TextField
            id="password"
            name="password"
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('password')}
            ref={passwordRef}
            trailing={(
              <button
                type="button"
                className="field__toggle"
                aria-pressed={showPassword}
                aria-controls="password"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? 'Сховати' : 'Показати'}
              </button>
            )}
          />

          <label className="checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={handleChange}
            />
            <span>Запам’ятати мене на 7 днів</span>
          </label>

          {authError && (
            <p className="login__error" role="alert">{authError}</p>
          )}

          <button type="submit" className="button button--primary login__submit">
            Увійти
          </button>
        </form>
      </section>
    </main>
  );
}
