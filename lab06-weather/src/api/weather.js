import { getJson } from './http.js';

/**
 * MetaWeather API закрили у 2022 році, тому використовуємо Open-Meteo:
 * безкоштовний, без ключа, з підтримкою CORS. https://open-meteo.com/
 */
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
export const FORECAST_DAYS = 5;

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'sunrise',
  'sunset',
];

// Вологість, тиск і видимість доступні погодинно — рахуємо середнє за день.
const HOURLY_FIELDS = ['relative_humidity_2m', 'pressure_msl', 'visibility'];

function average(values) {
  const numbers = values.filter(Number.isFinite);
  if (numbers.length === 0) return null;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function groupHourlyByDate(hourly) {
  const groups = new Map();
  hourly.time.forEach((time, index) => {
    const date = time.slice(0, 10);
    if (!groups.has(date)) {
      groups.set(date, { humidity: [], pressure: [], visibility: [] });
    }
    const group = groups.get(date);
    group.humidity.push(hourly.relative_humidity_2m[index]);
    group.pressure.push(hourly.pressure_msl[index]);
    group.visibility.push(hourly.visibility[index]);
  });
  return groups;
}

/** Перетворює відповідь Open-Meteo на масив днів у форматі застосунку. */
export function toDailyForecast({ daily, hourly }) {
  if (!daily?.time?.length) {
    throw new Error('Сервіс погоди повернув порожній прогноз.');
  }
  const hourlyByDate = hourly?.time ? groupHourlyByDate(hourly) : new Map();

  return daily.time.map((date, index) => {
    const hours = hourlyByDate.get(date);
    return {
      date,
      weatherCode: daily.weather_code[index],
      tempMax: daily.temperature_2m_max[index],
      tempMin: daily.temperature_2m_min[index],
      precipitationProbability: daily.precipitation_probability_max[index],
      windSpeed: daily.wind_speed_10m_max[index],
      windDirection: daily.wind_direction_10m_dominant[index],
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index],
      humidity: hours ? average(hours.humidity) : null,
      pressure: hours ? average(hours.pressure) : null,
      visibility: hours ? average(hours.visibility) : null,
    };
  });
}

/** Прогноз на FORECAST_DAYS днів для координат. */
export async function fetchForecast({ latitude, longitude }, { signal } = {}) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: DAILY_FIELDS.join(','),
    hourly: HOURLY_FIELDS.join(','),
    timezone: 'auto',
    forecast_days: String(FORECAST_DAYS),
    wind_speed_unit: 'kmh',
  });
  const data = await getJson(`${FORECAST_URL}?${params}`, {
    signal,
    serviceName: 'сервісом погоди',
  });
  return toDailyForecast(data);
}
