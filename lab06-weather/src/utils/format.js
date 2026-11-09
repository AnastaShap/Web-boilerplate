const LOCALE = 'uk-UA';
const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });
const dateFormatter = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long' });

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/** "2026-11-03" → Date у локальному часі (без зсуву через UTC). */
export function parseLocalDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Назва дня для картки: «Сьогодні», «Завтра» або день тижня, плюс дата. */
export function formatDayLabel(isoDate, index) {
  const date = parseLocalDate(isoDate);
  const weekday = capitalize(weekdayFormatter.format(date));
  const dayAndMonth = dateFormatter.format(date);

  if (index === 0) return { title: 'Сьогодні', subtitle: `${weekday}, ${dayAndMonth}` };
  if (index === 1) return { title: 'Завтра', subtitle: `${weekday}, ${dayAndMonth}` };
  return { title: weekday, subtitle: dayAndMonth };
}

/** Температура з типографським мінусом: −3°, 0°, 12°. */
export function formatTemperature(value) {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value);
  return rounded < 0 ? `−${Math.abs(rounded)}°` : `${rounded}°`;
}

/** "2026-11-03T06:52" → "06:52". */
export const formatTime = (isoDateTime) => (isoDateTime ? isoDateTime.slice(11, 16) : '—');

export function formatPercent(value) {
  return Number.isFinite(value) ? `${Math.round(value)}%` : '—';
}

/** Видимість у метрах → «8,5 км» або «24 км». */
export function formatVisibility(meters) {
  if (!Number.isFinite(meters)) return '—';
  const km = meters / 1000;
  const digits = km < 10 ? 1 : 0;
  return `${km.toLocaleString(LOCALE, { maximumFractionDigits: digits })} км`;
}
