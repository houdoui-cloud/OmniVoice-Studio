export function buildPastePlan(text, segments) {
  if (!text || !segments) return [];
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  return segments.map((seg, idx) => ({
    ...seg,
    text: lines[idx] !== undefined ? lines[idx] : seg.text,
  }));
}

export function detectPasteMode(text) {
  if (!text) return 'lines';
  if (text.includes('-->') || text.includes('WEBVTT')) return 'srt';
  return 'lines';
}
