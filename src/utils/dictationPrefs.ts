export interface DictationPrefs {
  language: string;
  autoPunctuation: boolean;
  pushToTalk: boolean;
}

const DEFAULT_PREFS: DictationPrefs = {
  language: 'auto',
  autoPunctuation: true,
  pushToTalk: false,
};

export function getDictationPrefs(): DictationPrefs {
  try {
    const raw = localStorage.getItem('ov_dictation_prefs');
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setDictationPrefs(prefs: Partial<DictationPrefs>): void {
  try {
    const curr = getDictationPrefs();
    localStorage.setItem('ov_dictation_prefs', JSON.stringify({ ...curr, ...prefs }));
  } catch {}
}
