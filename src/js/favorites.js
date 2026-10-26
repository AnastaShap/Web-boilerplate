import { createTeacherCard, createEmptyMessage } from './render.js';
 
const getVisibleCount = () => {
  const width = window.innerWidth;
  if (width >= 1024) return 5;
  if (width >= 768) return 3;
  if (width >= 480) return 2;
  return 1;
};

export function initFavorites({ container, prevButton, nextButton }){
    let favorites = [];
    let offset = 0;
    const render = () => {
        const visible = getVisibleCount();
        offset = Math.max(0, Math.min(offset, favorites.length - visible));

         if (favorites.length === 0) {
            container.replaceChildren(
                createEmptyMessage('No favorite teachers yet. Open a teacher and click the star to add one.'),
            );
            } else {
            container.replaceChildren(
                ...favorites.slice(offset, offset + visible).map((teacher) => createTeacherCard(teacher, { showSpeciality: false })),
            );
        }
        prevButton.disabled = offset === 0;
        nextButton.disabled = offset + visible >= favorites.length;
    };
    prevButton.addEventListener('click', () => {
        offset -= 1;
        render();
    });
    nextButton.addEventListener('click', () => {
        offset += 1;
        render();
    });
    window.addEventListener('resize', render);
    return{
        update(list){
            favorites = list;
            render();
        },
    };

}