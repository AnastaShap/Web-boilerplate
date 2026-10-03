document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.modal__close');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (!targetModal || !overlay) return;

    modals.forEach((modal) => modal.classList.remove('modal--active'));
    targetModal.classList.add('modal--active');
    overlay.style.display = 'flex';
  };

  const closeAllModals = () => {
    if (!overlay) return;
    overlay.style.display = 'none';
    modals.forEach((modal) => modal.classList.remove('modal--active'));
  };

  // Кнопки "Add teacher"
  const addButtons = document.querySelectorAll('.btn--outline');
  addButtons.forEach((btn) => {
    if (btn.textContent.trim().toLowerCase() === 'add teacher') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('modal-add-teacher');
      });
    }
  });

  // Картки викладачів
  const teacherCards = document.querySelectorAll('.teachers-grid .teacher-card');
  teacherCards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal-id');
      if (modalId) {
        openModal(modalId);
      }
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllModals();
    });
  });

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  }

  // Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
});
