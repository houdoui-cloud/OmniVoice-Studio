export function toMillis(ts) {
  if (typeof ts === 'number') {
    return ts < 1e11 ? ts * 1000 : ts;
  }
  return new Date(ts).getTime();
}

export function timeAgo(ts) {
  const millis = toMillis(ts);
  if (!millis || isNaN(millis)) return '';
  const diffSec = Math.floor((Date.now() - millis) / 1000);

  if (diffSec < 45) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return 'yesterday';
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export function absoluteTime(ts) {
  const millis = toMillis(ts);
  if (!millis || isNaN(millis)) return '';
  return new Date(millis).toLocaleString();
}
