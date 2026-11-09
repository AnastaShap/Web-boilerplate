/** Ім’я латиницею, одразу за ним номер курсу від 1 до 6: mark5, olena3. */
const LOGIN_PATTERN = /^[a-z]+[1-6]$/i;
const LOGIN_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 4;

/**
 * Перевіряє поля форми входу.
 * Повертає об’єкт помилок { login?, password? }; порожній об’єкт означає, що все гаразд.
 */
export function validateLoginForm({ login, password }) {
  const errors = {};
  const trimmedLogin = login.trim();

  if (!trimmedLogin) {
    errors.login = 'Введіть логін.';
  } else if (trimmedLogin.length > LOGIN_MAX_LENGTH) {
    errors.login = `Логін не може бути довшим за ${LOGIN_MAX_LENGTH} символів.`;
  } else if (!LOGIN_PATTERN.test(trimmedLogin)) {
    errors.login = 'Логін складається з імені латиницею та номера курсу від 1 до 6, наприклад mark5.';
  }

  if (!password) {
    errors.password = 'Введіть пароль.';
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Пароль має містити щонайменше ${PASSWORD_MIN_LENGTH} символи.`;
  }

  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
