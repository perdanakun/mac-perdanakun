export const appearanceStorageKey = 'perdana.appearance.v1';
export const appearanceModes = ['auto', 'light', 'dark'];

export function readAppearance(storage) {
  try {
    const value = storage.getItem(appearanceStorageKey);
    return appearanceModes.includes(value) ? value : 'auto';
  } catch { return 'auto'; }
}

export function resolveAppearance(mode, date = new Date(), schedule = { dayStart: 6, nightStart: 18 }) {
  if (mode === 'light' || mode === 'dark') return mode;
  const hour = date.getHours();
  return hour >= schedule.dayStart && hour < schedule.nightStart ? 'light' : 'dark';
}
