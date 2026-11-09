import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './auth-context.js';
import { AUTH_COOKIE, REMEMBER_ME_SECONDS } from '../config/auth.js';
import { checkCredentials, findUser } from '../services/authService.js';
import { deleteCookie, getCookie, setCookie } from '../utils/cookies.js';

/** Читаємо вхід із cookie і приймаємо лише відомих користувачів. */
function readUserFromCookie() {
  const login = getCookie(AUTH_COOKIE);
  return login && findUser(login) ? login : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUserFromCookie);

  /** Повертає true, якщо дані правильні; тоді зберігає вхід у cookie. */
  const login = useCallback((loginValue, password, { remember = false } = {}) => {
    const userLogin = checkCredentials(loginValue, password);
    if (!userLogin) return false;

    setCookie(AUTH_COOKIE, userLogin, {
      maxAge: remember ? REMEMBER_ME_SECONDS : undefined,
    });
    setUser(userLogin);
    return true;
  }, []);

  const logout = useCallback(() => {
    deleteCookie(AUTH_COOKIE);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
