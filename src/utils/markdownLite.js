export function inlineSegments(text = '') {
  if (!text) return [];
  const segments = [];
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'plain', text: text.slice(lastIndex, match.index) });
    }
    if (match[2]) {
      segments.push({ type: 'bold', text: match[2] });
    } else if (match[3]) {
      segments.push({ type: 'code', text: match[3] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'plain', text: text.slice(lastIndex) });
  }

  return segments;
}

export function parseBlocks(text = '') {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const blocks = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      const match = line.match(/^(#+)\s*(.+)$/);
      if (match) {
        blocks.push({
          type: 'heading',
          level: match[1].length,
          text: match[2],
        });
        continue;
      }
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        type: 'bullet',
        text: line.slice(2),
      });
      continue;
    }

    blocks.push({
      type: 'p',
      text: line,
    });
  }

  return blocks;
}
