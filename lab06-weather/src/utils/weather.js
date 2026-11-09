/**
 * Коди погоди WMO, які повертає Open-Meteo: https://open-meteo.com/en/docs
 * icon — назва піктограми з компонента WeatherIcon.
 */
const CONDITIONS = {
  0: { label: 'Ясно', icon: 'clear' },
  1: { label: 'Переважно ясно', icon: 'partly' },
  2: { label: 'Мінлива хмарність', icon: 'partly' },
  3: { label: 'Хмарно', icon: 'cloudy' },
  45: { label: 'Туман', icon: 'fog' },
  48: { label: 'Туман з інеєм', icon: 'fog' },
  51: { label: 'Слабка мряка', icon: 'rain' },
  53: { label: 'Мряка', icon: 'rain' },
  55: { label: 'Сильна мряка', icon: 'rain' },
  56: { label: 'Крижана мряка', icon: 'rain' },
  57: { label: 'Сильна крижана мряка', icon: 'rain' },
  61: { label: 'Невеликий дощ', icon: 'rain' },
  63: { label: 'Дощ', icon: 'rain' },
  65: { label: 'Сильний дощ', icon: 'rain' },
  66: { label: 'Крижаний дощ', icon: 'rain' },
  67: { label: 'Сильний крижаний дощ', icon: 'rain' },
  71: { label: 'Невеликий сніг', icon: 'snow' },
  73: { label: 'Сніг', icon: 'snow' },
  75: { label: 'Сильний сніг', icon: 'snow' },
  77: { label: 'Снігова крупа', icon: 'snow' },
  80: { label: 'Короткочасний дощ', icon: 'rain' },
  81: { label: 'Зливи', icon: 'rain' },
  82: { label: 'Сильні зливи', icon: 'rain' },
  85: { label: 'Снігопад', icon: 'snow' },
  86: { label: 'Сильний снігопад', icon: 'snow' },
  95: { label: 'Гроза', icon: 'storm' },
  96: { label: 'Гроза з градом', icon: 'storm' },
  99: { label: 'Сильна гроза з градом', icon: 'storm' },
};

const UNKNOWN_CONDITION = { label: 'Немає даних', icon: 'cloudy' };

export const describeWeather = (code) => CONDITIONS[code] ?? UNKNOWN_CONDITION;

const DIRECTIONS = [
  { short: 'пн', full: 'північний' },
  { short: 'пн-сх', full: 'північно-східний' },
  { short: 'сх', full: 'східний' },
  { short: 'пд-сх', full: 'південно-східний' },
  { short: 'пд', full: 'південний' },
  { short: 'пд-зх', full: 'південно-західний' },
  { short: 'зх', full: 'західний' },
  { short: 'пн-зх', full: 'північно-західний' },
];

/** Метеорологічний напрям (звідки дме вітер) у градусах → назва румба. */
export function describeWindDirection(degrees) {
  if (!Number.isFinite(degrees)) return null;
  const normalized = ((degrees % 360) + 360) % 360;
  return DIRECTIONS[Math.round(normalized / 45) % DIRECTIONS.length];
}

/** Мінімум і максимум температур за всі дні: спільна шкала для смужок у картках. */
export function getTemperatureScale(days) {
  const mins = days.map((day) => day.tempMin).filter(Number.isFinite);
  const maxs = days.map((day) => day.tempMax).filter(Number.isFinite);
  return { min: Math.min(...mins), max: Math.max(...maxs) };
}
