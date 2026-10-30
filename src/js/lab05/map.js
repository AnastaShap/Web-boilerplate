// Завдання 1 - Leaflet: карта з маркером у місці розташування викладача
// Leaflet підключено через <script> в index.html, тому тут доступна глобальна змінна L
/* global L */

let map = null;

// Знищуємо стару карту, інакше Leaflet не дасть створити нову в тому ж контейнері
export function destroyMap() {
  if (map) {
    map.remove();
    map = null;
  }
}

export function showMap(container, coordinates, name) {
  destroyMap();

  const lat = Number(coordinates?.latitude);
  const lng = Number(coordinates?.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    container.textContent = 'No coordinates for this teacher.';
    return;
  }

  const currentMap = L.map(container).setView([lat, lng], 4); // центр карти і масштаб
  map = currentMap;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(currentMap); // шар із самою картою

  L.marker([lat, lng]).addTo(currentMap).bindPopup(name).openPopup();

  

  // карта була прихована, тому просимо її перерахувати розмір
  setTimeout(() => {
    if (map === currentMap) currentMap.invalidateSize();
  }, 0);
}