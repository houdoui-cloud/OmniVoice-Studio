export const AUDIOBOOK_WPM = 150;

export function parseCastNames(script = '') {
  const names = new Set();
  const lines = script.split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z][A-Za-z0-9_\s]{1,24}):/);
    if (match) {
      names.add(match[1].trim());
    }
  }
  return Array.from(names);
}

export function scriptStats(script = '') {
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;
  const chars = script.length;
  const estSeconds = Math.round((words / AUDIOBOOK_WPM) * 60);
  return { words, chars, estSeconds };
}

export function formatRuntimeClock(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function validateScript(script = '') {
  return { valid: Boolean(script.trim()) };
}
