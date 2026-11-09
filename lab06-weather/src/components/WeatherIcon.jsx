/** Прості SVG-піктограми погоди. kind — значення icon з utils/weather.js. */

const CLOUD_PATH = 'M18 48h28a9.5 9.5 0 0 0 1.5-18.9A13.5 13.5 0 0 0 22.6 27 10.5 10.5 0 0 0 18 48z';

function Sun({ cx = 32, cy = 32, r = 11 }) {
  const rays = Array.from({ length: 8 }, (_, index) => {
    const angle = (index * Math.PI) / 4;
    const inner = r + 4;
    const outer = r + 9;
    return (
      <line
        key={index}
        x1={cx + inner * Math.cos(angle)}
        y1={cy + inner * Math.sin(angle)}
        x2={cx + outer * Math.cos(angle)}
        y2={cy + outer * Math.sin(angle)}
      />
    );
  });

  return (
    <g className="weather-icon__sun">
      <circle cx={cx} cy={cy} r={r} />
      <g className="weather-icon__rays">{rays}</g>
    </g>
  );
}

function Cloud({ dy = 0 }) {
  return <path className="weather-icon__cloud" d={CLOUD_PATH} transform={`translate(0 ${dy})`} />;
}

const ICONS = {
  clear: () => <Sun />,
  partly: () => (
    <>
      <Sun cx={24} cy={22} r={8} />
      <Cloud dy={4} />
    </>
  ),
  cloudy: () => <Cloud />,
  fog: () => (
    <g className="weather-icon__fog">
      <line x1="12" y1="24" x2="52" y2="24" />
      <line x1="8" y1="34" x2="48" y2="34" />
      <line x1="16" y1="44" x2="56" y2="44" />
    </g>
  ),
  rain: () => (
    <>
      <Cloud dy={-8} />
      <g className="weather-icon__drops">
        <line x1="22" y1="46" x2="19" y2="54" />
        <line x1="32" y1="46" x2="29" y2="54" />
        <line x1="42" y1="46" x2="39" y2="54" />
      </g>
    </>
  ),
  snow: () => (
    <>
      <Cloud dy={-8} />
      <g className="weather-icon__flakes">
        <circle cx="21" cy="49" r="2.4" />
        <circle cx="32" cy="53" r="2.4" />
        <circle cx="43" cy="49" r="2.4" />
      </g>
    </>
  ),
  storm: () => (
    <>
      <Cloud dy={-8} />
      <path className="weather-icon__bolt" d="M34 40 26 52h6l-3 9 10-13h-6l3-8z" />
    </>
  ),
};

export default function WeatherIcon({ kind, className = '' }) {
  const Icon = ICONS[kind] ?? ICONS.cloudy;
  return (
    <svg
      className={`weather-icon ${className}`.trim()}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <Icon />
    </svg>
  );
}
