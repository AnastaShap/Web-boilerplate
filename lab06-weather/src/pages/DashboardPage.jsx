import { useState } from 'react';
import Header from '../components/Header.jsx';
import Loader from '../components/Loader.jsx';
import LocationSwitch from '../components/LocationSwitch.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useWeather } from '../hooks/useWeather.js';
import { KYIV } from '../config/locations.js';
import { FORECAST_DAYS } from '../api/weather.js';
import { formatTime } from '../utils/format.js';
import { getTemperatureScale } from '../utils/weather.js';
import './DashboardPage.css';

const GEO_UNAVAILABLE = new Set(['denied', 'unsupported']);

/** Яке місце показувати з урахуванням вибору користувача і стану геолокації. */
function resolvePlace(source, geolocation) {
  if (source === 'kyiv' || GEO_UNAVAILABLE.has(geolocation.status)) return KYIV;
  if (geolocation.status === 'granted') return { ...geolocation.coords, name: null };
  return null; // чекаємо на відповідь браузера
}

export default function DashboardPage() {
  const geolocation = useGeolocation();
  const [source, setSource] = useState('geo');
  const geoUnavailable = GEO_UNAVAILABLE.has(geolocation.status);
  const activeSource = geoUnavailable ? 'kyiv' : source;

  const place = resolvePlace(source, geolocation);
  const weather = useWeather(place);
  const days = weather.status === 'success' ? weather.data.days : [];

  const placeTitle = weather.status === 'success'
    ? weather.data.placeName ?? 'Ваше місцезнаходження'
    : place?.name ?? 'Прогноз погоди';

  const renderForecast = () => {
    if (!place) return <Loader label="Визначаємо ваше місцезнаходження…" />;

    if (weather.status === 'error') {
      return (
        <div className="dashboard__error" role="alert">
          <p>{weather.error.message}</p>
          <button type="button" className="button button--primary" onClick={weather.reload}>
            Спробувати ще раз
          </button>
        </div>
      );
    }

    if (weather.status !== 'success') return <Loader label="Завантажуємо прогноз погоди…" />;

    const scale = getTemperatureScale(days);
    return (
      <ul className="forecast" aria-label={`Прогноз на ${FORECAST_DAYS} днів`}>
        {days.map((day, index) => (
          <li key={day.date} className="forecast__item">
            <WeatherCard day={day} index={index} scale={scale} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Header />
      <main className="dashboard">
        <section className="dashboard__intro">
          <div className="dashboard__heading">
            <h1 className="dashboard__place">{placeTitle}</h1>
            <p className="dashboard__subtitle">Прогноз на {FORECAST_DAYS} днів</p>
          </div>

          {days.length > 0 && (
            <dl className="dashboard__sun">
              <div>
                <dt>Схід сонця</dt>
                <dd>{formatTime(days[0].sunrise)}</dd>
              </div>
              <div>
                <dt>Захід сонця</dt>
                <dd>{formatTime(days[0].sunset)}</dd>
              </div>
            </dl>
          )}

          <LocationSwitch
            value={activeSource}
            onChange={setSource}
            geoDisabled={geoUnavailable}
          />
        </section>

        {geoUnavailable && (
          <p className="dashboard__notice">
            Ваше місцезнаходження недоступне, тому показуємо прогноз для Києва.
            Щоб бачити погоду поруч, дозвольте доступ до геолокації в налаштуваннях браузера.
          </p>
        )}

        {renderForecast()}

        <footer className="dashboard__footer">
          Дані про погоду:{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo.com</a>
        </footer>
      </main>
    </>
  );
}
