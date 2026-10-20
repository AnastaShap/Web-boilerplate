import { initModals, openModal, closeAllModals } from './modals.js';
import {
  initTeachers, getTeachers, addTeacher, getVisibleTeachers, getFavorites, getTeacherById, toggleFavorite,
  setFilters, setQuery,
} from './state.js';
import {
  createTeacherCard, createTeacherInfo, createEmptyMessage, setStarState,
} from './render.js';
import { initFavorites } from './favorites.js';
import { initStatistics } from './statistics.js';
import { readFilters, fillCountryOptions } from './filters.js';
import { initSearch, readQuery } from './search.js';
import { initTeacherForm } from './teacher-form.js';

function init() {
  const teachersGrid = document.getElementById('teachers-grid');
  const infoContent = document.getElementById('teacher-info-content');
  const filtersForm = document.querySelector('.filters');
  const searchForm = document.querySelector('.search-form');

  initTeachers();
  initModals();

  const favorites = initFavorites({
    container: document.getElementById('favorites-list'),
    prevButton: document.getElementById('favorites-prev'),
    nextButton: document.getElementById('favorites-next'),
  });

  const statistics = initStatistics({
    table: document.getElementById('statistics-table'),
    pagination: document.getElementById('statistics-pagination'),
  });

  /** Перемальовує всі списки, що залежать від стану викладачів. */
  const refresh = ({ resetPage = false } = {}) => {
    const visibleTeachers = getVisibleTeachers();
    teachersGrid.replaceChildren(
      ...(visibleTeachers.length > 0
        ? visibleTeachers.map((teacher) => createTeacherCard(teacher))
        : [createEmptyMessage('No teachers match your search or filters.')]),
    );
    favorites.update(getFavorites());
    statistics.update(visibleTeachers, { resetPage });
  };

  const showTeacherInfo = (id) => {
    const teacher = getTeacherById(id);
    if (!teacher) return;
    infoContent.replaceChildren(createTeacherInfo(teacher));
    openModal('modal-teacher-info');
  };

  // Клік або Enter/Space по картці (сітка та карусель) відкриває інформацію про викладача
  const handleCardActivate = (event) => {
    const card = event.target.closest('.teacher-card');
    if (!card) return;
    if (event.type === 'keydown') {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
    }
    showTeacherInfo(card.dataset.id);
  };

  [teachersGrid, document.getElementById('favorites-list')].forEach((container) => {
    container.addEventListener('click', handleCardActivate);
    container.addEventListener('keydown', handleCardActivate);
  });

  // Зірочка в модальному вікні: додати/прибрати з вибраних
  infoContent.addEventListener('click', (event) => {
    if (event.target.closest('.teacher-info__map-toggle')) {
      event.preventDefault(); // карта буде в одній із наступних лабораторних
      return;
    }
    const star = event.target.closest('.teacher-info__star');
    if (!star) return;

    const teacher = toggleFavorite(infoContent.firstElementChild.dataset.teacherId);
    setStarState(star, teacher.favorite);
    refresh();
  });

  // Фільтри та пошук разом визначають, яких викладачів показувати
  const applyView = () => {
    setFilters(readFilters(filtersForm));
    setQuery(readQuery(searchForm));
    refresh({ resetPage: true });
  };
  filtersForm.addEventListener('change', applyView);
  initSearch(searchForm, applyView);

  // Форма додавання викладача (teach_add_popup)
  initTeacherForm({
    form: document.getElementById('teach_add_form'),
    getTeachers,
    onAdd: (teacher) => {
      addTeacher(teacher);
      closeAllModals();
      fillCountryOptions(filtersForm.elements.country, getTeachers());
      applyView();
    },
  });

  // Форма фільтрів не має відправлятися на сервер
  filtersForm.addEventListener('submit', (e) => e.preventDefault());

  fillCountryOptions(filtersForm.elements.country, getTeachers());
  applyView(); // враховує значення, які браузер міг відновити після перезавантаження

  // Демо лабораторної №2 підвантажується лише з ?debug у URL
  if (new URLSearchParams(window.location.search).has('debug')) {
    import('./lab02.js').then(({ runLab02Demo }) => runLab02Demo());
  }
}

document.addEventListener('DOMContentLoaded', init);