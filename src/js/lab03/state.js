import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';
import { processAndMergeUsers, filterUsers, searchUsers } from './lab02.js';
 
let teachers = [];
let filters = {};
 let query = '';
 
export function initTeachers() {
  teachers = processAndMergeUsers(randomUserMock, additionalUsers);
  return teachers;
}
 
export const getTeachers = () => teachers;
 
export function setFilters(newFilters) {
  filters = newFilters;
}

export function setQuery(newQuery) {
  query = newQuery;
}

export const getFilteredTeachers = () => filterUsers(teachers, filters);
export const getFavorites = () => teachers.filter(teacher => teacher.isFavorite);
export const getTeahcherById = (id) => teachers.find((teacher) => teacher.id === id);

export function toggleFavorite(teacherId) {
    const teacher = getTeahcherById(teacherId);
    if (teacher) {
        teacher.isFavorite = !teacher.isFavorite;
    }
    return teacher;
}