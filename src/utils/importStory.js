export function importToText(fileName, content) {
  if (!content) return '';
  // Handles .txt, .md, .srt, or simple json
  if (fileName.endsWith('.json')) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => (typeof item === 'string' ? item : item.text || '')).join('\n');
      }
      if (parsed.text) return parsed.text;
    } catch {}
  }
  return content;
}
