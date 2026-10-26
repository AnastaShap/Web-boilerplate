import { formatUser } from './lab02.js';

const RANDOM_USER_URL = 'https://randomuser.me/api/';
const TEACHERS_URL = 'http://localhost:3000/teachers';
const SEED = 'teachinder';

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Завдання 1 і 4: GET https://randomuser.me/api/?results=N&page=P&seed=...
 * Повертає користувачів у форматі проєкту (formatUser).
 */
export async function fetchUsers({ results, page = 1 }) {
  const params = new URLSearchParams({ results, page, seed: SEED });
  const data = await request(`${RANDOM_USER_URL}?${params}`);

  if (!Array.isArray(data.results)) {
    throw new Error(data.error || 'Unexpected response from randomuser.me');
  }
  return data.results.map(formatUser);
}

/** Викладачі, раніше збережені у json-server. Якщо сервер не запущений — порожній список. */
export async function fetchSavedTeachers() {
  try {
    return await request(TEACHERS_URL);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('json-server is not available, saved teachers were not loaded.', error);
    return [];
  }
}

/** Завдання 5: POST провалідованого викладача на json-server. */
export const postTeacher = (teacher) => request(TEACHERS_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(teacher),
});
