export function parseScript(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results = [];

  for (const line of lines) {
    // Check for "SPEAKER: text" or "[SPEAKER] text"
    const colonMatch = line.match(/^([A-Za-z0-9_\s\-\.]{1,30})\s*:\s*(.+)$/);
    const bracketMatch = line.match(/^\[([A-Za-z0-9_\s\-\.]{1,30})\]\s*(.+)$/);

    if (colonMatch) {
      results.push({
        speaker: colonMatch[1].trim(),
        text: colonMatch[2].trim(),
      });
    } else if (bracketMatch) {
      results.push({
        speaker: bracketMatch[1].trim(),
        text: bracketMatch[2].trim(),
      });
    } else {
      results.push({
        speaker: 'Narrator',
        text: line,
      });
    }
  }

  return results;
}
