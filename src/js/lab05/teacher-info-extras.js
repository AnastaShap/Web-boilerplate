// Завдання 1 і 4 доповнює вікно "Teacher Info": день народження + карта
import { showMap, destroyMap } from './map.js';
import { getBirthdayText } from './birthday.js';

export function initTeacherInfoExtras(infoContent) {
  let teacher = null; // викладач, який зараз відкритий

  // Викликається з app.js одразу після того, як картку викладача намальовано
  function addExtras(currentTeacher) {
    teacher = currentTeacher;
    destroyMap();

    const info = infoContent.querySelector('.teacher-info');

    const birthdayText = getBirthdayText(teacher.b_date);
    if (birthdayText) {
      const p = document.createElement('p');
      p.textContent = birthdayText;
      info.querySelector('.teacher-info__details').append(p);
    }

    const mapBox = document.createElement('div');
    mapBox.className = 'lab5-map';
    mapBox.hidden = true; // спочатку карта прихована
    info.append(mapBox);
  }

  // Клік по "toggle map" показує або ховає карту
  infoContent.addEventListener('click', (event) => {
    if (!event.target.closest('.teacher-info__map-toggle')) return;
    event.preventDefault();

    const mapBox = infoContent.querySelector('.lab5-map');
    mapBox.hidden = !mapBox.hidden;

    if (mapBox.hidden) destroyMap();
    else showMap(mapBox, teacher.coordinates, teacher.full_name);
  });

  return { addExtras };
}