import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

// --- TASK 1 ---
export const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry',
  'Law', 'Art', 'Medicine', 'Statistics',
];

const GENDERS = ['male', 'female'];

const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);

const getRandomCourse = () => COURSES[Math.floor(Math.random() * COURSES.length)];

const calculateAge = (dateString) => {
  if (!dateString) return null;
  const birthDate = new Date(dateString);
  if (Number.isNaN(birthDate.getTime())) return null;
  const diffMs = Date.now() - birthDate.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export function formatUser(user) {
  const birthDate = user.dob?.date || user.b_date || user.b_day || null;
  const calculatedAge = user.dob?.age || user.age || calculateAge(birthDate);
  const hasCourse = typeof user.course === 'string' && user.course.trim() !== '';

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
    age: calculatedAge,
    phone: user.phone || null,
    picture_large: user.picture?.large || user.picture_large || null,
    picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail || null,

    id: user.login?.uuid || (typeof user.id === 'string' ? user.id : user.id?.value) || crypto.randomUUID(),
    favorite: typeof user.favorite === 'boolean' ? user.favorite : false,
    course: hasCourse ? capitalize(user.course.trim()) : getRandomCourse(),
    bg_color: typeof user.bg_color === 'string' ? user.bg_color : '#ffffff',
    note: typeof user.note === 'string' ? user.note : '',
  };
}

export function processAndMergeUsers(randomUsers = [], additional = []) {
  const formattedRandom = randomUsers.map(formatUser);
  const formattedAdditional = additional.map(formatUser);
  const combinedUsers = [...formattedRandom, ...formattedAdditional];

  const uniqueUsersMap = new Map();
  for (const user of combinedUsers) {
    const uniqueKey = user.email || user.id;
    if (!uniqueUsersMap.has(uniqueKey)) {
      uniqueUsersMap.set(uniqueKey, user);
    }
  }

  return Array.from(uniqueUsersMap.values());
}

// --- TASK 2 ---
// Перший символ — велика літера (або літера без регістру, напр. арабська/китайська).
const isCapitalized = (value) => {
  if (typeof value !== 'string' || value === '') return false;
  const [first] = Array.from(value);
  return /\p{L}/u.test(first) && first === first.toUpperCase();
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

const OPTIONAL_CAPITALIZED = {
  city: 'City',
  state: 'State',
  country: 'Country',
  note: 'Notes',
};

/** Повертає об'єкт { поле: повідомлення }. Порожній об'єкт — користувач валідний. */
export function getValidationErrors(user) {
  const errors = {};

  if (!user.full_name) {
    errors.full_name = 'Name is required.';
  } else if (!isCapitalized(user.full_name)) {
    errors.full_name = 'Name must start with a capital letter.';
  }

  if (!GENDERS.includes(String(user.gender).toLowerCase())) {
    errors.gender = 'Select gender.';
  }

  Object.entries(OPTIONAL_CAPITALIZED).forEach(([field, label]) => {
    if (user[field] && !isCapitalized(user[field])) {
      errors[field] = `${label} must start with a capital letter.`;
    }
  });

  if (typeof user.age !== 'number' || Number.isNaN(user.age)) {
    errors.age = 'Enter a valid date of birth.';
  } else if (user.age < 18 || user.age > 100) {
    errors.age = 'Age must be between 18 and 100.';
  }

  if (typeof user.email !== 'string' || !EMAIL_PATTERN.test(user.email)) {
    errors.email = 'Enter a valid email.';
  }

  if (typeof user.phone !== 'string' || !PHONE_PATTERN.test(user.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  return errors;
}

export const validateUser = (user) => Object.keys(getValidationErrors(user)).length === 0;

// --- TASK 3 ---
/**
 * Умова може бути:
 *  - undefined            -> ігнорується
 *  - функцією             -> predicate(value)
 *  - { min, max }         -> числовий діапазон (включно)
 *  - будь-яким іншим      -> строге порівняння ===
 */
const matchesCondition = (value, condition) => {
  if (condition === undefined) return true;
  if (typeof condition === 'function') return Boolean(condition(value));
  if (condition !== null && typeof condition === 'object' && ('min' in condition || 'max' in condition)) {
    return typeof value === 'number'
      && value >= (condition.min ?? -Infinity)
      && value <= (condition.max ?? Infinity);
  }
  return value === condition;
};

export function filterUsers(users, filterParams = {}) {
  return users.filter((user) => Object.entries(filterParams)
    .every(([key, condition]) => matchesCondition(user[key], condition)));
}

// --- TASK 4 ---
export function sortUsers(users, sortBy, order = 'asc') {
  return [...users].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    let comparison = 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    }

    return order === 'desc' ? -comparison : comparison;
  });
}

// --- TASK 5 ---
export function findUser(users, field, value) {
  return users.find((user) => {
    const userValue = user[field];

    if (typeof userValue === 'string' && typeof value === 'string') {
      return userValue.toLowerCase().includes(value.toLowerCase());
    }
    return userValue === value;
  });
}

/** Пошук за name, note (входження підрядка) та age (точний збіг числа). */
export function searchUsers(users, query = '') {
  const text = query.trim().toLowerCase();
  if (!text) return users;

  const numericQuery = /^\d+$/.test(text) ? Number(text) : null;

  return users.filter((user) => (
    user.full_name?.toLowerCase().includes(text)
    || user.note?.toLowerCase().includes(text)
    || (numericQuery !== null && user.age === numericQuery)
  ));
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

  const sorted = sortUsers(teachers, 'age', 'desc');
  console.log('4. Сортування за віком (спадання):', sorted);

  const found = findUser(teachers, 'full_name', 'Norbert');
  console.log('5. Пошук (Norbert):', found);

  const percentOver40 = getMatchingPercentage(teachers, (u) => u.age > 40);
  console.log(`6. Відсоток викладачів старше 40 років: ${percentOver40}%`);

  console.groupEnd();
}
