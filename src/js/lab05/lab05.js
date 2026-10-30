// Лаб 5
import { initTeacherInfoExtras } from './teacher-info-extras.js'; // Завд. 1 і 4
import { initStatistics } from './stats.js'; // Завд. 2 і 5

export function initLab05({ infoContent, statisticsSection }) {
  const info = initTeacherInfoExtras(infoContent);
  const statistics = initStatistics(statisticsSection);
  if (window.location.search.includes('lab5')) {
    import('./lodash-utils.js').then((module) => module.runLab05Demo());
  }

  return {
    addTeacherExtras: info.addExtras,
    updateStatistics: statistics.update,
  };
}