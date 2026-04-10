import { getStorageItem, setStorageItem } from '../hooks/useLocalStorage';

export const progressService = {
  // Activity log
  logActivity(action) {
    const log = getStorageItem('activity-log', []);
    log.unshift({ action, date: new Date().toISOString() });
    setStorageItem('activity-log', log.slice(0, 50));
  },

  getRecentActivity(count = 10) {
    return getStorageItem('activity-log', []).slice(0, count);
  },

  // Streak
  getStreak() {
    const data = getStorageItem('streak', { count: 0, lastDate: null });
    const today = new Date().toISOString().slice(0, 10);
    if (data.lastDate === today) return data.count;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (data.lastDate === yesterday) return data.count;
    return 0;
  },

  recordActivity() {
    const data = getStorageItem('streak', { count: 0, lastDate: null });
    const today = new Date().toISOString().slice(0, 10);
    if (data.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newCount = data.lastDate === yesterday ? data.count + 1 : 1;
    setStorageItem('streak', { count: newCount, lastDate: today });
  },

  // Puzzle stats
  recordPuzzleAttempt(puzzleId, category, correct) {
    const stats = getStorageItem('puzzle-stats', { total: 0, correct: 0, byCategory: {} });
    stats.total += 1;
    if (correct) stats.correct += 1;
    if (!stats.byCategory[category]) stats.byCategory[category] = { total: 0, correct: 0 };
    stats.byCategory[category].total += 1;
    if (correct) stats.byCategory[category].correct += 1;
    setStorageItem('puzzle-stats', stats);
    this.recordActivity();
    this.logActivity(`Solved puzzle: ${puzzleId} (${correct ? 'correct' : 'incorrect'})`);
  },

  getPuzzleStats() {
    return getStorageItem('puzzle-stats', { total: 0, correct: 0, byCategory: {} });
  },

  // Lesson progress
  markLessonComplete(type, lessonId) {
    const key = `${type}-completed`;
    const completed = getStorageItem(key, []);
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      setStorageItem(key, completed);
      this.logActivity(`Completed ${type} lesson: ${lessonId}`);
      this.recordActivity();
    }
  },

  isLessonComplete(type, lessonId) {
    return getStorageItem(`${type}-completed`, []).includes(lessonId);
  },

  getCompletedLessons(type) {
    return getStorageItem(`${type}-completed`, []);
  },

  // Opening stats
  recordOpeningDrill(openingId, side, accuracy) {
    const stats = getStorageItem('opening-stats', {});
    const key = `${openingId}-${side}`;
    if (!stats[key]) stats[key] = { attempts: 0, lastAccuracy: 0 };
    stats[key].attempts += 1;
    stats[key].lastAccuracy = accuracy;
    setStorageItem('opening-stats', stats);
    this.recordActivity();
    this.logActivity(`Opening drill: ${openingId} as ${side} — ${accuracy}%`);
  },

  getOpeningStats() {
    return getStorageItem('opening-stats', {});
  },

  // Visualisation drill stats
  recordDrillScore(drillType, score, accuracy) {
    const stats = getStorageItem('drill-stats', {});
    if (!stats[drillType]) stats[drillType] = { best: 0, attempts: 0, totalAccuracy: 0 };
    stats[drillType].attempts += 1;
    stats[drillType].totalAccuracy += accuracy;
    if (score > stats[drillType].best) stats[drillType].best = score;
    setStorageItem('drill-stats', stats);
    this.recordActivity();
    this.logActivity(`Visualisation drill: ${drillType} — score ${score}`);
  },

  getDrillStats() {
    return getStorageItem('drill-stats', {});
  },

  // Game annotations
  saveAnnotation(pgnHash, annotations) {
    const all = getStorageItem('annotations', {});
    all[pgnHash] = annotations;
    setStorageItem('annotations', all);
  },

  getAnnotation(pgnHash) {
    return getStorageItem('annotations', {})[pgnHash] || null;
  },

  // Reset
  resetAll() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('chess-mastery:'));
    keys.forEach(k => localStorage.removeItem(k));
  },
};
