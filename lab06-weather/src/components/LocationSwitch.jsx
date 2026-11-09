/**
 * Перемикач джерела прогнозу: геолокація користувача або Київ.
 * Кнопки з aria-pressed замість радіо, бо вибір застосовується одразу.
 */
export default function LocationSwitch({ value, onChange, geoDisabled }) {
  return (
    <div className="location-switch" role="group" aria-label="Місце для прогнозу">
      <button
        type="button"
        className="location-switch__option"
        aria-pressed={value === 'geo'}
        disabled={geoDisabled}
        onClick={() => onChange('geo')}
      >
        Моє місцезнаходження
      </button>
      <button
        type="button"
        className="location-switch__option"
        aria-pressed={value === 'kyiv'}
        onClick={() => onChange('kyiv')}
      >
        Київ
      </button>
    </div>
  );
}
