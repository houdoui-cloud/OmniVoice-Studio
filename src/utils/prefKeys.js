export const PREF_KEYS = [
  'theme',
  'language',
  'voice',
  'speed',
  'selectedEngine',
  'historyRetention',
  'advancedSettings',
];

export function clearLocalPreferences() {
  if (typeof window !== 'undefined' && window.localStorage) {
    for (const key of PREF_KEYS) {
      window.localStorage.removeItem(key);
    }
  }
}
