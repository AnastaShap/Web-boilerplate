import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

// --- TASK 1 ---
const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry',
  'Law', 'Art', 'Medicine', 'Statistics',
];

const getRandomCourse = () => COURSES[Math.floor(Math.random() * COURSES.length)];

const calculateAge = (dateString) => {
  if (!dateString) return null;
  const birthDate = new Date(dateString);
  const diffMs = Date.now() - birthDate.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export function formatUser(user) {
  const birthDate = user.dob?.date || user.b_date || user.b_day || null;
  const calculatedAge = user.dob?.age || user.age || calculateAge(birthDate);

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
    course: user.course || getRandomCourse(),
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
export function validateUser(user) {
  const isCapitalized = (val) => typeof val === 'string' && /^[A-ZА-ЯІЇЄҐ]/.test(val);

  if (!isCapitalized(user.full_name) || !isCapitalized(user.gender)) {
    return false;
  }

  const optionalFields = ['city', 'state', 'country', 'note'];
  for (const field of optionalFields) {
    if (user[field] && !isCapitalized(user[field])) {
      return false;
    }
  }

  if (typeof user.age !== 'number' || Number.isNaN(user.age)) {
    return false;
  }

  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    return false;
  }

  if (typeof user.phone !== 'string' || user.phone.trim() === '') {
    return false;
  }

  return true;
}

// --- TASK 3 ---
export function filterUsers(users, filterParams) {
  return users.filter((user) => {
    return Object.entries(filterParams).every(([key, value]) => {
      if (value === undefined) return true; //=== строге порівняння без приведення типу
      return user[key] === value;
    });
  });
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

    if (typeof userValue === 'string' && typeof value === 'string') 
    {
      return userValue.toLowerCase().includes(value.toLowerCase());
    }
    return userValue === value;

  });
}

// --- TASK 6 ---
export function getMatchingPercentage(users, searchCondition)
{
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