const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const modals = document.querySelectorAll('.modal');
  if (!overlay) return;

  let lastFocused = null;

  const getActiveModal = () => document.querySelector('.modal--active');
  const isOpen = () => overlay.style.display === 'flex';

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;

    lastFocused = document.activeElement;
    modals.forEach((modal) => modal.classList.remove('modal--active'));
    targetModal.classList.add('modal--active');
    overlay.style.display = 'flex';
    targetModal.querySelector('.modal__close')?.focus();
  };

  const closeAllModals = () => {
    overlay.style.display = 'none';
    modals.forEach((modal) => modal.classList.remove('modal--active'));
    lastFocused?.focus();
    lastFocused = null;
  };

  // Будь-який елемент з data-modal-open (кнопки "Add teacher" у хедері та футері)
  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.modalOpen);
    });
  });

  // Делегування для карток викладачів (миша та клавіатура)
  const teachersGrid = document.querySelector('.teachers-grid');
  if (teachersGrid) {
    const openFromCard = (target) => {
      const card = target.closest('.teacher-card');
      const modalId = card?.dataset.modalId;
      if (modalId) openModal(modalId);
    };

    teachersGrid.addEventListener('click', (e) => openFromCard(e.target));
    teachersGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFromCard(e.target);
      }
    });
  }

  document.querySelectorAll('.modal__close').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAllModals();
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;

    if (e.key === 'Escape') {
      closeAllModals();
      return;
    }

    // Фокус-трап: Tab не виходить за межі активного вікна
    if (e.key === 'Tab') {
      const focusable = [...getActiveModal().querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}