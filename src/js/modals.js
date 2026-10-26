const getOverlay = () => document.getElementById('modal-overlay');

export function closeAllModals() {
  const overlay = getOverlay();
  if (!overlay) return;
  overlay.style.display = 'none';
  document.querySelectorAll('.modal').forEach((modal) => modal.classList.remove('modal--active'));
}

export function openModal(modalId) {
  const overlay = getOverlay();
  const targetModal = document.getElementById(modalId);
  if (!targetModal || !overlay) return;

  document.querySelectorAll('.modal').forEach((modal) => modal.classList.remove('modal--active'));
  targetModal.classList.add('modal--active');
  overlay.style.display = 'flex';
}

/**
 * Відкриття: будь-який елемент з data-modal-open="<id модалки>".
 * Закриття: хрестик, клік по затемненню, Escape.
 * Відкриття модалки з інформацією про викладача виконує app.js.
 */
export function initModals() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-modal-open]');
    if (trigger) {
      event.preventDefault();
      openModal(trigger.dataset.modalOpen);
      return;
    }
    if (event.target.closest('.modal__close') || event.target === getOverlay()) {
      closeAllModals();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllModals();
  });
}
