import { getJson } from './http.js';

/** Безкоштовне зворотне геокодування без ключа: координати → назва населеного пункту. */
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/**
 * Повертає назву місця або null. Назва не критична для прогнозу,
 * тому помилки тут не ламають сторінку (крім скасування запиту).
 */
export async function fetchPlaceName({ latitude, longitude }, { signal } = {}) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'uk',
  });

  try {
    const data = await getJson(`${REVERSE_GEOCODE_URL}?${params}`, {
      signal,
      serviceName: 'сервісом геокодування',
    });
    return data.city || data.locality || data.principalSubdivision || null;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return null;
  }
}
