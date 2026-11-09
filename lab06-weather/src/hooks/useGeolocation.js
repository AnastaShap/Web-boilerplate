import { useEffect, useState } from 'react';

const GEOLOCATION_OPTIONS = {
  timeout: 10_000,
  maximumAge: 10 * 60 * 1000, // приймаємо позицію, отриману до 10 хв тому
};

const isSupported = () => typeof navigator !== 'undefined' && 'geolocation' in navigator;

/**
 * Один раз запитує координати користувача.
 * status: 'pending' | 'granted' | 'denied' | 'unsupported'
 */
export function useGeolocation() {
  const [state, setState] = useState(() => ({
    status: isSupported() ? 'pending' : 'unsupported',
    coords: null,
  }));

  useEffect(() => {
    if (!isSupported()) return undefined;
    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (cancelled) return;
        setState({
          status: 'granted',
          coords: { latitude: coords.latitude, longitude: coords.longitude },
        });
      },
      () => {
        if (!cancelled) setState({ status: 'denied', coords: null });
      },
      GEOLOCATION_OPTIONS,
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
