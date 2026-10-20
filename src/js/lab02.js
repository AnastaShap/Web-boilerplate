import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

// --- TASK 1 ---
const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry',
  'Law', 'Art', 'Medicine', 'Statistics',
];

const getRandomCourse = () => COURSES[Math.floor(Math.random() * COURSES.length)];


const normalizeCourse = (course) => {
  if (typeof course !== 'string' || course.trim() === '') return getRandomCourse();
  const trimmed = course.trim();
  const known = COURSES.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  return known || trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};


const normalizeDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};


export const calculateAge = (dateString, now = new Date()) => {
  if (!dateString) return null;
  const birth = new Date(dateString);
  if (Number.isNaN(birth.getTime())) return null;

  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - birth.getUTCMonth();
  const birthdayNotYet = monthDiff < 0
    || (monthDiff === 0 && now.getUTCDate() < birth.getUTCDate());
  if (birthdayNotYet) age -= 1;

  return age;
};

export function formatUser(user) {
  const birthDate = normalizeDate(user.dob?.date || user.b_date || user.b_day);
  // Вік рахуємо з дати народження; значення з моку — лише запасний варіант
  const age = calculateAge(birthDate) ?? user.dob?.age ?? user.age ?? null;

  const rawId = typeof user.id === 'string' ? user.id : user.id?.value;

  return {
    gender: user.gender || null,
    title: user.name?.title || user.title || null,
    full_name: user.name ? `${user.name.first} ${user.name.last}` : (user.full_name || null),
    city: user.location?.city || user.city || null,
    state: user.location?.state || user.state || null,
    country: user.location?.country || user.country || null,
    postcode: user.location?.postcode || user.postcode || null,
    coordinates: user.location?.coordinates || user.coordinates || null,
    timezone: user.location?.timezone || user.timezone || null,
    email: user.email || null,
    b_date: birthDate,
    age,
    phone: user.phone || null,
    picture_large: user.picture?.large || user.picture_large || null,
    picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail || null,

    id: user.login?.uuid || rawId || crypto.randomUUID(),
    favorite: typeof user.favorite === 'boolean' ? user.favorite : false,
    course: normalizeCourse(user.course),
    bg_color: typeof user.bg_color === 'string' ? user.bg_color : '#ffffff',
    note: typeof user.note === 'string' ? user.note : '',
  };
}

/**
 * Ключ дедуплікації: email (без регістру), а якщо його немає — повне ім'я.
 */
const getUniqueKey = (user) => {
  if (user.email) return `email:${user.email.toLowerCase()}`;
  if (user.full_name) return `name:${user.full_name.toLowerCase()}`;
  return `id:${user.id}`;
};

export function processAndMergeUsers(randomUsers = [], additional = []) {
  const combinedUsers = [...randomUsers, ...additional].map(formatUser);

  const uniqueUsersMap = new Map();
  for (const user of combinedUsers) {
    const key = getUniqueKey(user);
    if (!uniqueUsersMap.has(key)) {
      uniqueUsersMap.set(key, user);
    }
  }

  return Array.from(uniqueUsersMap.values());
}

// --- TASK 2 ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_REGEX = /^[+()\d\s\-.]+$/;

const isCapitalized = (val) => typeof val === 'string' && /^[A-ZА-ЯІЇЄҐ]/.test(val);

const isValidPhone = (phone) => {
  if (typeof phone !== 'string' || !PHONE_ALLOWED_REGEX.test(phone.trim())) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export function validateUser(user) {
  if (!isCapitalized(user.full_name) || !isCapitalized(user.gender)) {
    return false;
  }

  const optionalFields = ['city', 'state', 'country', 'note'];
  for (const field of optionalFields) {
    if (user[field] && !isCapitalized(user[field])) {
      return false;
    }
  }

  if (!Number.isInteger(user.age) || user.age < 0 || user.age > 120) {
    return false;
  }

  if (typeof user.email !== 'string' || !EMAIL_REGEX.test(user.email)) {
    return false;
  }

  return isValidPhone(user.phone);
}
// --- TASK 3 ---
const matchesFilter = (userValue, condition) => {
  if (typeof condition === 'function') return Boolean(condition(userValue));

  if (Array.isArray(condition)) {
    return condition.some((item) => matchesFilter(userValue, item));
  }

  if (condition !== null && typeof condition === 'object') {
    if (typeof userValue !== 'number') return false;
    const { min = -Infinity, max = Infinity } = condition;
    return userValue >= min && userValue <= max;
  }

  if (typeof condition === 'string' && typeof userValue === 'string') {
    return userValue.toLowerCase() === condition.toLowerCase();
  }

  return userValue === condition;
};

export function filterUsers(users, filterParams = {}) {
  return users.filter((user) => Object.entries(filterParams).every(([key, condition]) => {
    if (condition === undefined) return true;
    return matchesFilter(user[key], condition);
  }));
}

// --- TASK 4 ---
const DATE_FIELDS = new Set(['b_date']);

/** Приводить значення до порівнюваного вигляду (дати -> timestamp). */
const getComparable = (user, field) => {
  const value = user[field];
  if (value === undefined || value === null) return null;
  if (DATE_FIELDS.has(field)) {
    const time = Date.parse(value);
    return Number.isNaN(time) ? null : time;
  }
  return value;
};

const compareValues = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }
  return 0;
};

export function sortUsers(users, sortBy, order = 'asc') {
  const direction = order === 'desc' ? -1 : 1;

  return [...users].sort((a, b) => {
    const valA = getComparable(a, sortBy);
    const valB = getComparable(b, sortBy);

    // Порожні значення завжди в кінці, незалежно від напрямку
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;

    return compareValues(valA, valB) * direction;
  });
}

// --- TASK 5 ---
const matchesSearch = (userValue, query) => {
  if (userValue === undefined || userValue === null) return false;
  if (typeof userValue === 'string' && typeof query === 'string') {
    return userValue.toLowerCase().includes(query.toLowerCase());
  }
  if (typeof userValue === 'number' && typeof query === 'string' && query.trim() !== '') {
    return userValue === Number(query);
  }
  return userValue === query;
};

/** field — назва поля або масив полів (пошук за будь-яким із них). */
export function findUser(users, field, value) {
  const fields = Array.isArray(field) ? field : [field];
  return users.find((user) => fields.some((f) => matchesSearch(user[f], value)));
}

/** Усі збіги за name, note та age — для рядка пошуку в UI. */
export function searchUsers(users, query) {
  const trimmed = String(query ?? '').trim();
  if (trimmed === '') return users;
  return users.filter((user) => ['full_name', 'note', 'age']
    .some((f) => matchesSearch(user[f], trimmed)));
}

// --- TASK 6 ---
export function getMatchingPercentage(users, searchCondition) {
  if (!users || users.length === 0) return 0;
  const matchedUsers = users.filter(searchCondition);
  return Math.round((matchedUsers.length / users.length) * 100);
}

export function runLab02Demo() {
  console.group('=== ЛАБОРАТОРНА РОБОТА №2 ===');

  const teachers = processAndMergeUsers(randomUserMock, additionalUsers);
  console.log('1. Злиття та форматування (без дублікатів):', teachers);

  const validCount = teachers.filter(validateUser).length;
  console.log(`2. Валідація: ${validCount} з ${teachers.length} викладачів валідні.`);

  const filtered = filterUsers(teachers, { country: 'Germany', gender: 'male' });
  console.log('3. Фільтрація (Німеччина, чоловіки):', filtered);

  const byAgeRange = filterUsers(teachers, { age: { min: 18, max: 31 } });
  console.log('3a. Фільтрація (вік 18–31):', byAgeRange);

  const sortedByAge = sortUsers(teachers, 'age', 'desc');
  console.log('4. Сортування за віком (спадання):', sortedByAge);

  const sortedByDate = sortUsers(teachers, 'b_date', 'asc');
  console.log('4a. Сортування за датою народження (від найстарших):', sortedByDate);

  const found = findUser(teachers, 'full_name', 'Norbert');
  console.log('5. Пошук (Norbert):', found);

  const searched = searchUsers(teachers, 'cats');
  console.log('5a. Пошук за name/note/age ("cats"):', searched);

  const percentOver40 = getMatchingPercentage(teachers, (u) => u.age > 40);
  console.log(`6. Відсоток викладачів старше 40 років: ${percentOver40}%`);

  console.groupEnd();
}