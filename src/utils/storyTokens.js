export function hasStoryMarkers(text) {
  if (!text) return false;
  return /\[(pause|fast|spell|voice:)/.test(text) || text.startsWith('# ');
}

export function parseStoryText(text) {
  return text || '';
}

export function applyInlineVoice(text, voiceId) {
  return `[voice:${voiceId}] ${text}`;
}

export function insertToken(text, token, cursorStart = 0, cursorEnd = 0) {
  const before = text.slice(0, cursorStart);
  const selected = text.slice(cursorStart, cursorEnd);
  const after = text.slice(cursorEnd);

  if (selected) {
    return `${before}[${token}]${selected}[/${token}]${after}`;
  }
  return `${before}[${token}]${after}`;
}
