import { initModals, openModal, closeAllModals } from './modals.js';
import {
  initTeachers, loadMoreTeachers, getTeachers, addTeacher, getVisibleTeachers, getFavorites,
  getTeacherById, toggleFavorite, setFilters, setQuery,
} from './state.js';
import { postTeacher } from './api.js';
import {
  createTeacherCard, createTeacherInfo, createEmptyMessage, setStarState,
} from './render.js';
import { initFavorites } from './favorites.js';
import { initStatistics } from './statistics.js';
import { readFilters, fillCountryOptions } from './filters.js';
import { initSearch, readQuery } from './search.js';
import { initTeacherForm } from './teacher-form.js';

async function init() {
  const teachersGrid = document.getElementById('teachers-grid');
  const teachersStatus = document.getElementById('teachers-status');
  const nextButton = document.getElementById('teachers-next');
  const infoContent = document.getElementById('teacher-info-content');
  const filtersForm = document.querySelector('.filters');
  const searchForm = document.querySelector('.search-form');

  initModals();

  // Завдання 1: початкові дані беруться із запиту
  teachersGrid.replaceChildren(createEmptyMessage('Loading teachers…'));
  let loadFailed = false;
  try {
    await initTeachers();
  } catch (error) {
    console.error(error);
    loadFailed = true;
  }

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
    teachersGrid.replaceChildren(...(visibleTeachers.length > 0 ? 
        visibleTeachers.map((teacher) => createTeacherCard(teacher))
        : [createEmptyMessage('No teachers match your search or filters.')]),
    );
    favorites.update(getFavorites());
    statistics.update(visibleTeachers, {
       resetPage 
      });
  };

  const showTeacherInfo = (id) => {
    const teacher = getTeacherById(id);
    if (!teacher) return;
    infoContent.replaceChildren(createTeacherInfo(teacher));
    openModal('modal-teacher-info');
  };


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

  // Завдання 2: фільтри та пошук працюють з даними із запиту
  const applyView = () => {
    setFilters(readFilters(filtersForm));
    setQuery(readQuery(searchForm));
    refresh({ resetPage: true });
  };
  filtersForm.addEventListener('change', applyView);
  filtersForm.addEventListener('submit', (e) => e.preventDefault());
  initSearch(searchForm, applyView);

  // Завдання 4: "Next" завантажує ще 10 користувачів і додає їх до сторінки
  nextButton.addEventListener('click', async () => {
    nextButton.disabled = true;
    nextButton.textContent = 'Loading…';
    teachersStatus.textContent = '';
    try {
      await loadMoreTeachers();
      fillCountryOptions(filtersForm.elements.country, getTeachers());
      refresh(); // статистика бачить нову кількість, сторінку не скидаємо
    } catch (error) {
      console.error(error);
      teachersStatus.textContent = 'Could not load more teachers. Please try again.';
    } finally {
      nextButton.disabled = false;
      nextButton.textContent = 'Next';
    }
  });

  // Завдання 5: валідна форма -> POST на json-server -> додавання на сторінку
  initTeacherForm({
    form: document.getElementById('teach_add_form'),
    getTeachers,
    onAdd: async (teacher) => {
      await postTeacher(teacher); // якщо сервер недоступний — помилка покажеться у формі
      addTeacher(teacher);
      closeAllModals();
      fillCountryOptions(filtersForm.elements.country, getTeachers());
      applyView();
    },
  });

  fillCountryOptions(filtersForm.elements.country, getTeachers());
  applyView(); // враховує значення, які браузер міг відновити після перезавантаження

  if (loadFailed) {
    teachersGrid.replaceChildren(
      createEmptyMessage('Could not load teachers. Check your connection and reload the page.'),
    );
  }

  // Демо лаб 2 підвантажується лише з ?debug у URL
  if (new URLSearchParams(window.location.search).has('debug')) {
    import('./lab02.js').then(({ runLab02Demo }) => runLab02Demo());
  }
}

document.addEventListener('DOMContentLoaded', init);