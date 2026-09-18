export function storyToSpans(tracks = [], cast = []) {
  const castMap = new Map();
  for (const c of cast) {
    castMap.set(c.id, c.profileId || c.id);
  }

  const chapters = [];
  let currentChapter = {
    title: 'Chapter 1',
    spans: [],
  };

  for (const track of tracks) {
    let rawText = (track.text || '').trim();
    if (!rawText) continue;

    if (rawText.startsWith('# ')) {
      const title = rawText.slice(2).trim();
      if (currentChapter.spans.length > 0) {
        chapters.push(currentChapter);
      }
      currentChapter = {
        title,
        spans: [],
      };
      continue;
    }

    const defaultVoice = track.profileId || castMap.get(track.character) || 'aria';
    const lineSpeed = track.speed != null ? track.speed : null;

    // Handle inline tokens: [pause Xs], [fast]...[/fast], [spell]...[/spell], [voice:xxx]
    // Simple parser
    let currentVoice = defaultVoice;
    let parts = [rawText];

    // Split by tags
    const tokenRegex = /(\[pause\s+([\d\.]+)s?\]|\[fast\](.*?)\[\/fast\]|\[spell\](.*?)\[\/spell\]|\[voice:([^\]]+)\])/g;

    let lastIdx = 0;
    let match;
    let lineSpans = [];

    while ((match = tokenRegex.exec(rawText)) !== null) {
      const matchStart = match.index;
      if (matchStart > lastIdx) {
        const textChunk = rawText.slice(lastIdx, matchStart).trim();
        if (textChunk) {
          lineSpans.push({
            voice_id: currentVoice,
            text: textChunk,
            pause_ms_after: 0,
            speed: lineSpeed,
          });
        }
      }

      if (match[1].startsWith('[pause')) {
        const pauseSec = parseFloat(match[2]) || 0;
        const pauseMs = Math.round(pauseSec * 1000);
        if (lineSpans.length > 0) {
          lineSpans[lineSpans.length - 1].pause_ms_after = pauseMs;
        } else {
          lineSpans.push({
            voice_id: currentVoice,
            text: '',
            pause_ms_after: pauseMs,
            speed: lineSpeed,
          });
        }
      } else if (match[1].startsWith('[fast]')) {
        lineSpans.push({
          voice_id: currentVoice,
          text: match[3],
          pause_ms_after: 0,
          speed: 1.15,
        });
      } else if (match[1].startsWith('[spell]')) {
        lineSpans.push({
          voice_id: currentVoice,
          text: match[4].split('').join(' '),
          pause_ms_after: 0,
          speed: lineSpeed,
        });
      } else if (match[1].startsWith('[voice:')) {
        currentVoice = match[5];
      }

      lastIdx = tokenRegex.lastIndex;
    }

    if (lastIdx < rawText.length) {
      const tail = rawText.slice(lastIdx).trim();
      if (tail) {
        lineSpans.push({
          voice_id: currentVoice,
          text: tail,
          pause_ms_after: 0,
          speed: lineSpeed,
        });
      }
    }

    if (lineSpans.length > 0) {
      currentChapter.spans.push(...lineSpans);
    }
  }

  if (currentChapter.spans.length > 0) {
    chapters.push(currentChapter);
  }

  return chapters;
}
