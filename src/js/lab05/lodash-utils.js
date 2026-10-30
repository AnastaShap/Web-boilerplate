// Завдання 3 lodash: ті самі функції з лаби 2, але через lodash
/* global _ */ // lodash підключено через <script> в index.html
import { COURSES } from '../lab02.js';

const {
  filter,
  find,
  get,
  includes,
  isEmpty,
  isString,
  map,
  orderBy,
  round,
  toLower,
  trim,
  uniqBy,
} = _;

// ---------- 1. Мапінг ----------
// _.get безпечно дістає вкладене поле і підставляє запасне значення, якщо його немає
export function formatUser(user) {
  const birthDate = get(user, 'dob.date') || user.b_date || user.b_day || null;

  return {
    gender: user.gender ?? null,
    title: get(user, 'name.title', user.title) ?? null,
    full_name: user.name ? `${user.name.first} ${user.name.last}` : user.full_name ?? null,
    city: get(user, 'location.city', user.city) ?? null,
    state: get(user, 'location.state', user.state) ?? null,
    country: get(user, 'location.country', user.country) ?? null,
    postcode: get(user, 'location.postcode', user.postcode) ?? null,
    coordinates: get(user, 'location.coordinates', user.coordinates) ?? null,
    timezone: get(user, 'location.timezone', user.timezone) ?? null,
    email: user.email ?? null,
    b_date: birthDate,
    age: get(user, 'dob.age', user.age) ?? null,
    phone: user.phone ?? null,
    picture_large: get(user, 'picture.large', user.picture_large) ?? null,
    picture_thumbnail: get(user, 'picture.thumbnail', user.picture_thumbnail) ?? null,
    id: get(user, 'login.uuid') || user.id || crypto.randomUUID(),
    favorite: user.favorite === true,
    course: user.course || COURSES[Math.floor(Math.random() * COURSES.length)],
    bg_color: user.bg_color || '#ffffff',
    note: user.note || '',
  };
}

// _.map перетворює список, _.uniqBy прибирає дублікати за email
export const processAndMergeUsers = (randomUsers, additional) => uniqBy(
  map([...randomUsers, ...additional], formatUser),
  (user) => user.email || user.id,
);

// ---------- 2. Валідація ----------
const startsWithCapital = (value) => isString(value) && /^[A-ZА-ЯІЇЄҐ]/.test(value);

// Повертає об'єкт помилок { поле: текст }. Порожній об'єкт = усе гаразд.
export function getValidationErrors(user) {
  const errors = {};

  if (!startsWithCapital(user.full_name)) errors.full_name = 'Name must start with a capital letter.';
  if (!includes(['male', 'female'], toLower(user.gender))) errors.gender = 'Please select a gender.';
  if (!Number.isFinite(user.age)) errors.age = 'Date of birth is required.';
  if (!includes(user.email, '@')) errors.email = 'Enter a valid email.';
  if (isEmpty(trim(user.phone))) errors.phone = 'Phone is required.';

  ['city', 'state', 'country', 'note'].forEach((field) => {
    if (!isEmpty(user[field]) && !startsWithCapital(user[field])) {
      errors[field] = 'Must start with a capital letter.';
    }
  });

  return errors;
}

export const validateUser = (user) => isEmpty(getValidationErrors(user));

// ---------- 3. Фільтрація ----------
// params: { country: 'Germany', age: { min: 18, max: 31 }, picture_large: (v) => Boolean(v) }
export const filterUsers = (users, params = {}) => filter(users, (user) => (
  Object.entries(params).every(([field, expected]) => {
    if (expected === undefined) return true; // фільтр не задано
    if (typeof expected === 'function') return expected(user[field]); // власна умова
    if (typeof expected === 'object') return user[field] >= expected.min && user[field] <= expected.max; // діапазон
    return user[field] === expected; // точний збіг
  })
));

// ---------- 4. Сортування ----------
// _.orderBy сортує за полем; order — 'asc' або 'desc'
export const sortUsers = (users, field, order = 'asc') => orderBy(users, [field], [order]);

// ---------- 5. Пошук ----------
// Один користувач за полем (для рядків — частковий збіг без урахування регістру)
export const findUser = (users, field, value) => find(users, (user) => (
  isString(user[field]) && isString(value)
    ? includes(toLower(user[field]), toLower(value))
    : user[field] === value
));

// Пошук для рядка пошуку на сторінці: ім'я, нотатки або вік
export function searchUsers(users, query) {
  const text = toLower(trim(query));
  if (!text) return users;

  return filter(users, (user) => (
    includes(toLower(user.full_name), text)
    || includes(toLower(user.note), text)
    || String(user.age) === text
  ));
}

// ---------- 6. Відсоток ----------
export const getMatchingPercentage = (users, condition) => (
  isEmpty(users) ? 0 : round((filter(users, condition).length / users.length) * 100)
);

// ---------- Демо в консолі (?lab5 в URL) ----------
export async function runLab05Demo() {
  const { randomUserMock, additionalUsers } = await import('../FE4U-Lab2-mock.js');
  const users = processAndMergeUsers(randomUserMock, additionalUsers);

  console.group('Лаб 5: lodash');
  console.log('Мапінг і злиття:', users);
  console.log('Валідних:', filter(users, validateUser).length, 'з', users.length);
  console.log('Фільтр (Germany, male):', filterUsers(users, { country: 'Germany', gender: 'male' }));
  console.log('Сортування за віком:', map(sortUsers(users, 'age', 'desc'), 'age'));
  console.log('Пошук "Norbert":', findUser(users, 'full_name', 'Norbert'));
  console.log('Старше 40:', `${getMatchingPercentage(users, (u) => u.age > 40)}%`);
  console.groupEnd();
}