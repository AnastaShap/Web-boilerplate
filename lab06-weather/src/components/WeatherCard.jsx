import WeatherIcon from './WeatherIcon.jsx';
import { describeWeather, describeWindDirection } from '../utils/weather.js';
import {
  formatDayLabel,
  formatPercent,
  formatTemperature,
  formatVisibility,
} from '../utils/format.js';
import './WeatherCard.css';

const MIN_BAR_SPAN = 6; // %, щоб смужка не зникала, коли min і max майже рівні

/** Позиція відрізка min…max на спільній шкалі всіх днів, у відсотках. */
function getBarInsets(tempMin, tempMax, scale) {
  const range = scale.max - scale.min || 1;
  let start = ((tempMin - scale.min) / range) * 100;
  let end = ((scale.max - tempMax) / range) * 100;

  const span = 100 - start - end;
  if (span < MIN_BAR_SPAN) {
    const shift = (MIN_BAR_SPAN - span) / 2;
    start = Math.max(0, start - shift);
    end = Math.max(0, end - shift);
  }
  return { start, end };
}

function WindArrow({ degrees }) {
  // Метеонапрям вказує, ЗВІДКИ дме вітер; стрілка показує, КУДИ.
  return (
    <svg
      className="weather-card__wind-arrow"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ transform: `rotate(${degrees + 180}deg)` }}
    >
      <path d="M8 1 13.5 7.5H9.6V15H6.4V7.5H2.5z" />
    </svg>
  );
}

/**
 * Один день прогнозу. Усі п’ять блоків на сторінці — це цей самий
 * компонент, який отримує свої значення через props.
 */
export default function WeatherCard({ day, index, scale }) {
  const { title, subtitle } = formatDayLabel(day.date, index);
  const condition = describeWeather(day.weatherCode);
  const direction = describeWindDirection(day.windDirection);
  const { start, end } = getBarInsets(day.tempMin, day.tempMax, scale);
  const max = formatTemperature(day.tempMax);
  const min = formatTemperature(day.tempMin);

  return (
    <article className="weather-card">
      <header className="weather-card__header">
        <h2 className="weather-card__day">{title}</h2>
        <p className="weather-card__date">{subtitle}</p>
      </header>

      <WeatherIcon kind={condition.icon} className="weather-card__icon" />
      <p className="weather-card__condition">{condition.label}</p>

      <div
        className="weather-card__temps"
        role="img"
        aria-label={`Від ${min} до ${max}`}
        style={{ '--start': `${start}%`, '--end': `${end}%` }}
      >
        <span className="weather-card__max">{max}</span>
        <span className="weather-card__track">
          <span className="weather-card__fill" />
        </span>
        <span className="weather-card__min">{min}</span>
      </div>

      <dl className="weather-card__details">
        <div className="weather-card__detail">
          <dt>Вітер</dt>
          <dd title={direction ? `Вітер ${direction.full}` : undefined}>
            {direction && <WindArrow degrees={day.windDirection} />}
            {Number.isFinite(day.windSpeed) ? `${Math.round(day.windSpeed)} км/год` : '—'}
            {direction && <span className="weather-card__muted"> {direction.short}</span>}
          </dd>
        </div>
        <div className="weather-card__detail">
          <dt>Ймовірність опадів</dt>
          <dd>{formatPercent(day.precipitationProbability)}</dd>
        </div>
        <div className="weather-card__detail">
          <dt>Вологість</dt>
          <dd>{formatPercent(day.humidity)}</dd>
        </div>
        <div className="weather-card__detail">
          <dt>Тиск</dt>
          <dd>{Number.isFinite(day.pressure) ? `${Math.round(day.pressure)} гПа` : '—'}</dd>
        </div>
        <div className="weather-card__detail">
          <dt>Видимість</dt>
          <dd>{formatVisibility(day.visibility)}</dd>
        </div>
      </dl>
    </article>
  );
}
