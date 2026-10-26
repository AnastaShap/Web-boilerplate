import { fillSelectOptions } from './render.js';


const parseAgeRange = (value) => {
  if (!value) return undefined;
  const [min, max] = value.split('-').map(Number);
  return { min, max };
};


 //Зчитує значення форми фільтрів у параметри для filterUsers()
export function readFilters(form) {
  const data = new FormData(form);

  return {
    age: parseAgeRange(data.get('age')),
    country: data.get('country') || undefined,
    gender: data.get('gender') || undefined,
    picture_large: data.has('with-photo') ? (value) => Boolean(value) : undefined,
    favorite: data.has('favorites') ? true : undefined,
  };
}

export function fillCountryOptions(select, teachers) {
  const selected = select.value;
  const [allOption] = select.options;
  const countries = [...new Set(teachers.map((teacher) => teacher.country).filter(Boolean))].sort();
 
  select.replaceChildren(allOption);
  fillSelectOptions(select, countries);
  select.value = selected;
}