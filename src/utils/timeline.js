export const SNAP_PX = 8;

const defaultColors = {
  regionBg: 'rgba(211, 134, 155, 0.2)',
  regionBorder: '#d3869b',
  activeRegionBg: 'rgba(211, 134, 155, 0.4)',
};

const listeners = new Set();

export function getRegionColors() {
  return defaultColors;
}

export function subscribeRegionColors(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function visibleSegmentRange(segments = [], startSec = 0, endSec = Infinity) {
  return segments.filter(
    (s) => (s.start >= startSec && s.start <= endSec) || (s.end >= startSec && s.end <= endSec) || (s.start <= startSec && s.end >= endSec)
  );
}

export function snapCandidates(segments = [], activeId = null) {
  const points = [];
  for (const seg of segments) {
    if (seg.id === activeId) continue;
    if (seg.start != null) points.push(seg.start);
    if (seg.end != null) points.push(seg.end);
  }
  return points;
}

export function snapTime(time, candidates = [], threshold = 0.05) {
  let closest = time;
  let minDiff = threshold;

  for (const c of candidates) {
    const diff = Math.abs(time - c);
    if (diff < minDiff) {
      minDiff = diff;
      closest = c;
    }
  }

  return closest;
}

export function clampSegmentEdit(start, end, minDuration = 0.1, maxDuration = Infinity) {
  const safeStart = Math.max(0, start);
  const duration = Math.max(minDuration, Math.min(maxDuration, end - safeStart));
  return [safeStart, safeStart + duration];
}

export function detectOverlaps(segments = []) {
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  const overlaps = new Set();

  for (let i = 0; i < sorted.length - 1; i++) {
    const cur = sorted[i];
    const next = sorted[i + 1];
    if (cur.end > next.start) {
      overlaps.add(cur.id);
      overlaps.add(next.id);
    }
  }

  return overlaps;
}

export function nearestOnset(time, onsets = [], threshold = 0.05) {
  return snapTime(time, onsets, threshold);
}

export function commitMoveResize(segments, segId, newStart, newEnd) {
  return segments.map((seg) => {
    if (seg.id === segId) {
      return {
        ...seg,
        start: Math.max(0, newStart),
        end: Math.max(newStart + 0.1, newEnd),
      };
    }
    return seg;
  });
}
