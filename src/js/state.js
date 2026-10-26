import { fetchUsers, fetchSavedTeachers } from './api.js';
import { filterUsers, searchUsers } from './lab02.js';

const INITIAL_COUNT = 50;
export const PAGE_SIZE = 10;

let teachers = [];
let filters = {};
let query = '';
// Перші 50 користувачів вже завантажені тому "далі" починається з наступного блоку по 10
let nextPage = INITIAL_COUNT / PAGE_SIZE + 1;

const uniqueKey = (teacher) => teacher.email || teacher.id;

/** Додає лише тих, кого ще немає в списку (за email або id) */
function mergeUnique(current, incoming) {
  const seen = new Set(current.map(uniqueKey));
  const fresh = incoming.filter((teacher) => {
    const key = uniqueKey(teacher);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [...current, ...fresh];
}

/** Завдання 1: 50 користувачів із API*/
export async function initTeachers() {
  const [users, saved] = await Promise.all([
    fetchUsers({ results: INITIAL_COUNT }),
    fetchSavedTeachers(),
  ]);
  teachers = mergeUnique(users, saved);
  return teachers;
}

/** Завдання 4: наступні 10 користувачів додаються до наявних */
export async function loadMoreTeachers() {
  const users = await fetchUsers({ results: PAGE_SIZE, page: nextPage });
  nextPage += 1;
  teachers = mergeUnique(teachers, users);
  return teachers;
}

export const getTeachers = () => teachers;

export function addTeacher(teacher) {
  teachers = mergeUnique(teachers, [teacher]);
  return teacher;
}

export function setFilters(newFilters) {
  filters = newFilters;
}

export function setQuery(newQuery) {
  query = newQuery;
}

/** Викладачі після застосування фільтрів і пошуку (Завдання 2) */
export const getVisibleTeachers = () => searchUsers(filterUsers(teachers, filters), query);

export const getFavorites = () => teachers.filter((teacher) => teacher.favorite);

export const getTeacherById = (id) => teachers.find((teacher) => teacher.id === id);

export function toggleFavorite(teacherId) {
  const teacher = getTeacherById(teacherId);
  if (teacher) {
    teacher.favorite = !teacher.favorite;
  }
  return teacher;
}
