/**
 * Поле форми з підписом, підказкою і повідомленням про помилку.
 * ref передається напряму в <input> (React 19), щоб форма могла
 * поставити фокус на перше поле з помилкою.
 */
export default function TextField({
  id,
  label,
  hint,
  error,
  trailing,
  ref,
  ...inputProps
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={error ? 'field field--invalid' : 'field'}>
      <label className="field__label" htmlFor={id}>{label}</label>
      {hint && <p id={hintId} className="field__hint">{hint}</p>}
      <div className="field__control">
        <input
          id={id}
          ref={ref}
          className="field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && <p id={errorId} className="field__error">{error}</p>}
    </div>
  );
}
