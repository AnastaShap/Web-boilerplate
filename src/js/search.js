
export const readQuery = (form) => form.elements.query.value.trim();

/**
 (Завдання 4).
 функціональність пошуку по викладачах 
за параметрами: ім’я, коментар та вік (name, note, age) 
 */
export function initSearch(form, onSearch) {
  form.elements.query.addEventListener('input', onSearch);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSearch();
  });
}