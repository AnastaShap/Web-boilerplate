export function initModals() {
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

  //  "Add teacher"
  const addButtons = document.querySelectorAll('.btn--outline');
  addButtons.forEach((btn) => {
    if (btn.textContent.trim().toLowerCase().includes('add teacher')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal('modal-add-teacher');
      });
    }
  });

  // Делегування кліку для карток викладачів (знаходить картку навіть при кліку на фото/текст)
  const teachersGrid = document.querySelector('.teachers-grid');
  if (teachersGrid) {
    teachersGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.teacher-card');
      if (card) {
        const modalId = card.getAttribute('data-modal-id');
        if (modalId) {
          e.stopPropagation();
          openModal(modalId);
        }
      }
    });
  }

  // Запобігання миттєвому закриттю при кліку всередині модального вікна
  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // 4. Закриття через хрестик
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
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}