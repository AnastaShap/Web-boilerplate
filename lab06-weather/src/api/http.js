/**
 * fetch + JSON з людськими повідомленнями про помилки.
 * AbortError прокидаємо далі без змін: це не помилка, а скасований запит.
 */
export async function getJson(url, { signal, serviceName = 'сервісу' } = {}) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(`Немає з’єднання із ${serviceName}. Перевірте інтернет і спробуйте ще раз.`);
  }

  if (!response.ok) {
    throw new Error(`Не вдалося отримати дані від ${serviceName} (код ${response.status}).`);
  }
  return response.json();
}
