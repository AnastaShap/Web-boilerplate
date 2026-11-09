import { USERS } from '../config/auth.js';

const normalizeLogin = (login) => login.trim().toLowerCase();

/** Шукає користувача за логіном (без урахування регістру). */
export function findUser(login) {
  const normalized = normalizeLogin(login);
  return USERS.find((user) => user.login.toLowerCase() === normalized) ?? null;
}

/** Повертає логін користувача, якщо пара логін/пароль правильна, інакше null. */
export function checkCredentials(login, password) {
  const user = findUser(login);
  return user && user.password === password ? user.login : null;
}
