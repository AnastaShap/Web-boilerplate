import { useCallback, useEffect, useState } from 'react';
import { fetchForecast } from '../api/weather.js';
import { fetchPlaceName } from '../api/geocoding.js';

const INITIAL_STATE = { status: 'idle', data: null, error: null };

/**
 * Завантажує прогноз для місця { latitude, longitude, name? }.
 * Якщо name не передано, визначає назву через зворотне геокодування.
 * status: 'idle' | 'loading' | 'success' | 'error'
 */
export function useWeather(place) {
  const [state, setState] = useState(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  const latitude = place?.latitude;
  const longitude = place?.longitude;
  const knownName = place?.name ?? null;

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return undefined;

    // Скасовуємо запит, якщо місце змінилося або компонент зник зі сторінки.
    const controller = new AbortController();
    const coords = { latitude, longitude };
    const { signal } = controller;

    setState((previous) => ({ ...previous, status: 'loading', error: null }));

    Promise.all([
      fetchForecast(coords, { signal }),
      knownName ?? fetchPlaceName(coords, { signal }),
    ])
      .then(([days, placeName]) => {
        setState({ status: 'success', data: { days, placeName }, error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setState({ status: 'error', data: null, error });
      });

    return () => controller.abort();
  }, [latitude, longitude, knownName, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, reload };
}
