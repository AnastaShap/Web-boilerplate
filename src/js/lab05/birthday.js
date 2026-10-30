// Завдання 4 скільки днів до наступного дня народження
/* global dayjs */ // Day.js підключено через <script> в index.html

export function getBirthdayText(birthDate) {
  const birth = dayjs(birthDate);
  if (!birthDate || !birth.isValid()) return '';

  const today = dayjs().startOf('day');


  let next = birth.year(today.year()).startOf('day');

  if (next.isBefore(today)) {
    next = next.add(1, 'year');
  }

  const days = next.diff(today, 'day'); // різниця в днях
  if (days === 0) return 'Birthday: today';
  return `Next birthday in ${days} ${days === 1 ? 'day' : 'days'}`;
}