import { sortUsers } from './lab02.js';
import { createStatisticsRow, createEmptyRow, createPageLink } from './render.js';

const PAGE_SIZE = 10;
const ARIA_SORT = { asc: 'ascending', desc: 'descending' };


/**
 * Таблиця статистики: сортування по кліку на заголовок (Завдання 3) + пагінація.
 * Перший клік по колонці — за зростанням, повторний — за спаданням.
 */
export function initStatistics({ table, pagination }) {
  const tbody = table.tBodies[0];
  const sortableHeaders = [...table.querySelectorAll('th[data-sort]')];
 
  let teachers = [];
  let sort = { field: null, order: 'asc' };
  let page = 1;
 
  const render = () => {
    const sorted = sort.field ? sortUsers(teachers, sort.field, sort.order) : teachers;
    const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    page = Math.min(page, pageCount);
 
    const rows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    tbody.replaceChildren(...(rows.length > 0 ? rows.map(createStatisticsRow) : [createEmptyRow()]));
 
    pagination.replaceChildren(
      ...(pageCount > 1
        ? Array.from({ length: pageCount }, (_, i) => createPageLink(i + 1, i + 1 === page))
        : []),
    );
    updateSortIndicators();
  };
 
  table.tHead.addEventListener('click', (event) => {
    const header = event.target.closest('[data-sort]');
    if (!header) return;
 
    const field = header.dataset.sort;
    const order = sort.field === field && sort.order === 'asc' ? 'desc' : 'asc';
    sort = { field, order };
    page = 1;
    render();
  });
 
  pagination.addEventListener('click', (event) => {
    const link = event.target.closest('[data-page]');
    if (!link) return;
 
    event.preventDefault();
    page = Number(link.dataset.page);
    render();
    pagination.querySelector('[aria-current="page"]')?.focus();
  });
 
  return {
    update(list, { resetPage = false } = {}) {
      teachers = list;
      if (resetPage) page = 1;
      render();
    },
  };
}