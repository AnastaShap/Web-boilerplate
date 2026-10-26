import { COURSES, formatUser, getValidationErrors } from './lab02.js';
import { fillSelectOptions } from './render.js';

const DEFAULT_COUNTRY = 'Ukraine';
const FIELD_FOR_ERROR = { age: 'b_date' };
const SAVE_ERROR = 'Could not save the teacher. Make sure json-server is running (npm run server) and try again.';

const getGroup = (form, fieldName) => form.querySelector(`[name="${fieldName}"]`)?.closest('.form-group');

function setError(group, message) {
  group.classList.toggle('form-group--invalid', Boolean(message));
  let box = group.querySelector('.form-error');

  if (!message) {
    box?.remove();
    return;
  }
  if (!box) {
    box = document.createElement('p');
    box.className = 'form-error';
    box.setAttribute('role', 'alert');
    group.append(box);
  }
  box.textContent = message;
}

function setFormError(form, message) {
  const box = form.querySelector('.form-error--general');
  box.textContent = message;
  box.hidden = !message;
}

function clearErrors(form) {
  form.querySelectorAll('.form-group--invalid').forEach((group) => setError(group, ''));
  setFormError(form, '');
}

function showErrors(form, errors) {
  clearErrors(form);
  Object.entries(errors).forEach(([field, message]) => {
    const group = getGroup(form, FIELD_FOR_ERROR[field] || field);
    if (group) setError(group, message);
  });
  form.querySelector('.form-group--invalid :is(input, select, textarea)')?.focus();
}

/** Країни з даних + країна за замовчуванням */
function fillCountries(select, teachers) {
  const countries = [...new Set([...teachers.map((t) => t.country), DEFAULT_COUNTRY].filter(Boolean))].sort();

  select.replaceChildren();
  fillSelectOptions(select, countries);
  select.value = DEFAULT_COUNTRY;
  // щоб form.reset() повертав країну за замовчуванням
  [...select.options].find((option) => option.value === DEFAULT_COUNTRY).defaultSelected = true;
}

/** Перетворює значення форми на об*єкт викладача того ж формату, що й дані з API */
function readTeacher(form) {
  const data = new FormData(form);
  const text = (name) => String(data.get(name) ?? '').trim();

  return formatUser({
    full_name: text('full_name'),
    gender: text('gender'),
    course: text('course'),
    country: text('country'),
    city: text('city'),
    email: text('email'),
    phone: text('phone'),
    b_day: text('b_date'),
    bg_color: text('bg_color'),
    note: text('note'),
  });
}

export function initTeacherForm({ form, getTeachers, onAdd }) {
  const submitButton = form.querySelector('[type="submit"]');

  fillSelectOptions(form.elements.course, COURSES);
  fillCountries(form.elements.country, getTeachers());
  form.elements.b_date.max = new Date().toISOString().slice(0, 10);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const teacher = readTeacher(form);
    const errors = getValidationErrors(teacher);

    const emailTaken = teacher.email
      && getTeachers().some((t) => t.email?.toLowerCase() === teacher.email.toLowerCase());
    if (emailTaken && !errors.email) errors.email = 'A teacher with this email already exists.';

    if (Object.keys(errors).length > 0) {
      showErrors(form, errors);
      return;
    }

    clearErrors(form);
    submitButton.disabled = true;
    try {
      await onAdd(teacher);
      form.reset();
    } catch (error) {
      console.error(error);
      setFormError(form, SAVE_ERROR);
    } finally {
      submitButton.disabled = false;
    }
  });

  form.addEventListener('input', (event) => {
    setFormError(form, '');
    const group = event.target.closest('.form-group');
    if (group) setError(group, '');
  });
}
