// Завдання 2 Chart.js (кругові діаграми) і Завдання 5 WebDataRocks (звіти)
// Бібліотеки підключено через <script> в index.html, тому доступні глобальні Chart, WebDataRocks, _
/* global Chart, WebDataRocks, _ */
const { countBy, map, pick } = _;

// ---------- Chart.js ----------
const COLORS = [
  '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40',
  '#8bc34a', '#e91e63', '#00bcd4', '#795548', '#607d8b', '#c9cbcf',
];

function getAgeGroup(teacher) {
  const { age } = teacher;
  if (!age) return 'Unknown';
  if (age <= 31) return '18-31';
  if (age <= 45) return '32-45';
  if (age <= 60) return '46-60';
  return '61+';
}

const CHARTS = [
  { title: 'By speciality', getKey: (t) => t.course },
  { title: 'By age', getKey: getAgeGroup },
  { title: 'By gender', getKey: (t) => t.gender },
  { title: 'By nationality', getKey: (t) => t.country },
];

// ---------- WebDataRocks ----------
// Назви колонок, які бачить користувач
const COLUMN_NAMES = {
  full_name: { caption: 'Name' },
  course: { caption: 'Speciality' },
  age: { caption: 'Age', type: 'number' },
  gender: { caption: 'Gender' },
  country: { caption: 'Country' },
  city: { caption: 'City' },
  email: { caption: 'Email' },
  phone: { caption: 'Phone' },
};
const FIELDS = Object.keys(COLUMN_NAMES);

const COUNTRY_SLICE = {
  rows: [{ uniqueName: 'country' }],
  columns: [{ uniqueName: 'Measures' }],
  measures: [{ uniqueName: 'full_name', aggregation: 'count', caption: 'Teachers' }],
};

// Плоска таблиця: кожне поле окрема колонка
const FLAT_SLICE = {
  rows: map(FIELDS, (name) => ({ uniqueName: name })),
};

export function initStatistics(section) {
  // стару таблицю й пагінацію ховаємо
  section.querySelectorAll('.statistics-table, .pagination').forEach((el) => {
    el.style.display = 'none';
  });

  section.insertAdjacentHTML('beforeend', `
    <div class="lab5-switch">
      <button type="button" class="btn btn--outline" data-view="charts">Charts</button>
      <button type="button" class="btn btn--outline" data-view="countries">Report by country</button>
      <button type="button" class="btn btn--outline" data-view="flat">All teachers</button>
    </div>
    <div class="lab5-charts"></div>
    <div id="lab5-pivot" hidden></div>
  `);
  const chartsBox = section.querySelector('.lab5-charts');
  const pivotBox = section.querySelector('#lab5-pivot');

  let teachers = [];
  let view = 'charts';
  let pivot = null;

  // створюємо 4 порожні діаграми
  const charts = CHARTS.map(({ title, getKey }) => {
    const canvas = document.createElement('canvas');
    const box = document.createElement('div');
    box.className = 'lab5-chart';
    box.insertAdjacentHTML('beforeend', `<h3>${title}</h3>`);
    box.append(canvas);
    chartsBox.append(box);

    const chart = new Chart(canvas, {
      type: 'pie',
      data: { labels: [], datasets: [{ data: [] }] },
      options: { plugins: { legend: { position: 'bottom' } } },
    });
    return { chart, getKey };
  });

  // заповнюємо діаграми даними
  function showCharts() {
    charts.forEach(({ chart, getKey }) => {
      const counts = countBy(teachers, getKey); // наприклад { Germany: 3, France: 2 }
      const labels = Object.keys(counts);

      chart.data.labels = labels;
      chart.data.datasets[0].data = Object.values(counts);
      chart.data.datasets[0].backgroundColor = map(labels, (label, i) => COLORS[i % COLORS.length]);
      chart.update();
    });
  }

  function showPivot() {
    const report = {
      dataSource: {
        data: map(teachers, (t) => pick(t, FIELDS)), // беремо лише потрібні поля
        mapping: COLUMN_NAMES,
      },
      slice: view === 'flat' ? FLAT_SLICE : COUNTRY_SLICE,
      options: { grid: { type: view === 'flat' ? 'flat' : 'compact' } },
    };

    if (pivot) {
      pivot.setReport(report);
    } else {
      pivot = new WebDataRocks({
        container: '#lab5-pivot',
        width: '100%',
        height: 500,
        toolbar: false,
        report,
      });
    }
  }

  function render() {
    chartsBox.hidden = view !== 'charts';
    pivotBox.hidden = view === 'charts';
    if (view === 'charts') showCharts();
    else showPivot();
  }

  section.querySelector('.lab5-switch').addEventListener('click', (event) => {
    const button = event.target.closest('[data-view]');
    if (!button) return;
    view = button.dataset.view;
    render();
  });

  return {
    update(list) {
      teachers = list;
      render();
    },
  };
}