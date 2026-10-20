/** Поточний пошуковий запит без зайвих пробілів. */
export const readQuery = (form) => form.elements.query.value.trim();

/**
 * Пошук за name, note та age (Завдання 4).
 * Працює "наживо" під час введення, а також по Enter / кнопці Search.
 */
export function initSearch(form, onSearch) {
  form.elements.query.addEventListener('input', onSearch);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSearch();
  });
}