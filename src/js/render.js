/** Створює елемент: 
 * props задаються як властивості, а role та aria-атрибути  через setAttribute. */
const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);
export function getInitials(fullName = '') {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0].toUpperCase())
    .join('.');
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
 
  Object.entries(props).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === 'dataset') {
      Object.assign(node.dataset, value);
    } else if (key === 'role' || key.startsWith('aria-')) {
      node.setAttribute(key, value);
    } else {
      node[key] = value;
    }
  });
 
  node.append(...children.filter((child) => child != null && child !== false));
  return node;
}

const applyBackground = (node, color) => {
  if (color) node.style.backgroundColor = color;
};

function createAvatar(teacher){
    const wrap = el('div', { className: 'teacher-card__avatar-wrap' });

    const showInitials = () => {
        wrap.classList.add('teacher-card__avatar-wrap--initials');
        wrap.replaceChildren(
            el('span', { className: 'teacher-card__avatar-initials', textContent: getInitials(teacher.fullName) })
        );
    };
    if (teacher.picture_large) {
        const img = el('img', {
        className: 'teacher-card__avatar',
        src: teacher.picture_large,
        alt: teacher.full_name,
        width: 120,
        height: 120,
        loading: 'lazy',
        });
        img.addEventListener('error', showInitials, { once: true });
        wrap.append(img);
    } else {
        showInitials();
    }
    
    return wrap;
}

export function createTeacherCard(teacher, { showSpeciality = true } = {}) {
  const [firstName, ...rest] = (teacher.full_name || '').split(' ');
 
  return el(
    'article',
    {
      className: `teacher-card${teacher.favorite ? ' teacher-card--favorite' : ''}`,
      dataset: { id: teacher.id },
      tabIndex: 0,
      role: 'button',
    },
    createAvatar(teacher),
    el('h3', { className: 'teacher-card__name' }, firstName, el('br'), rest.join(' ')),
    showSpeciality ? el('p', { className: 'teacher-card__speciality', textContent: teacher.course }) : null,
    el('p', { className: 'teacher-card__country', textContent: teacher.country || '' }),
  );
}
 
// ---------- Модальне вікно "Teacher Info" ----------
 
export function setStarState(button, isFavorite) {
  button.textContent = isFavorite ? '★' : '☆';
  button.classList.toggle('teacher-info__star--active', isFavorite);
  button.setAttribute('aria-pressed', String(isFavorite));
  button.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
}

function createInfoPhoto(teacher) {
  if (teacher.picture_large) {
    return el('img', {
      className: 'teacher-info__photo',
      src: teacher.picture_large,
      alt: teacher.full_name,
      width: 200,
      height: 200,
    });
  }
  const placeholder = el('div', {
    className: 'teacher-info__photo teacher-info__photo--initials',
    textContent: getInitials(teacher.full_name),
  });
  applyBackground(placeholder, teacher.bg_color);
  return placeholder;
}
 
export function createTeacherInfo(teacher) {
  const star = el('button', { className: 'teacher-info__star', type: 'button' });
  setStarState(star, teacher.favorite);
 
  const location = [teacher.city, teacher.country].filter(Boolean).join(', ');
  const meta = [teacher.age, capitalize(teacher.gender || '')].filter(Boolean).join(', ');
 
  const details = el(
    'div',
    { className: 'teacher-info__details' },
    el('div', { className: 'teacher-info__top' },
      el('h4', { className: 'teacher-info__name', textContent: teacher.full_name }),
      star),
    el('p', { className: 'teacher-info__subject', textContent: teacher.course }),
    location ? el('p', { className: 'teacher-info__location', textContent: location }) : null,
    meta ? el('p', { className: 'teacher-info__meta', textContent: meta }) : null,
    teacher.email
      ? el('a', { className: 'teacher-info__link', href: `mailto:${teacher.email}`, textContent: teacher.email })
      : null,
    teacher.phone ? el('p', { className: 'teacher-info__phone', textContent: teacher.phone }) : null,
  );
 
  return el(
    'div',
    { className: 'teacher-info', dataset: { teacherId: teacher.id } },
    el('div', { className: 'teacher-info__grid' }, createInfoPhoto(teacher), details),
    teacher.note ? el('p', { className: 'teacher-info__desc', textContent: teacher.note }) : null,
    el('a', { className: 'teacher-info__map-toggle', href: '#', textContent: 'toggle map' }),
  );
}
 
// ---------- Допоміжні елементи ----------
 
export const createEmptyMessage = (text) => el('p', { className: 'empty-message', textContent: text });
 
export function fillSelectOptions(select, values) {
  select.append(...values.map((value) => el('option', { value, textContent: value })));
}
 
// ---------- Статистика ----------
 
// Name, Speciality, Age, Gender, Nationality
export const STATISTICS_COLUMNS = 5;
 
export function createStatisticsRow(teacher) {
  const cells = [
    teacher.full_name,
    teacher.course,
    teacher.age,
    capitalize(teacher.gender || ''),
    teacher.country,
  ];
 
  return el('tr', {}, ...cells.map((value) => el('td', { textContent: value ?? '' })));
}
 
export const createEmptyRow = () => el(
  'tr',
  {},
  el('td', { colSpan: STATISTICS_COLUMNS, className: 'empty-message', textContent: 'No data to display.' }),
);
 
export const createPageLink = (page, isCurrent) => el('a', {
  href: '#',
  textContent: String(page),
  dataset: { page },
  'aria-current': isCurrent ? 'page' : null,
});
 