/**
 * Мінімальна обгортка над document.cookie.
 * maxAge у секундах; без нього cookie живе до закриття браузера (сесійна).
 */
export function setCookie(name, value, { maxAge } = {}) {
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    'path=/',
    'SameSite=Lax',
  ];
  if (maxAge) parts.push(`max-age=${maxAge}`);
  if (window.location.protocol === 'https:') parts.push('Secure');
  document.cookie = parts.join('; ');
}

export function getCookie(name) {
  const prefix = `${encodeURIComponent(name)}=`;
  const entry = document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

export function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
}
