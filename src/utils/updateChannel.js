export function normalizeChannel(channel) {
  if (channel === 'beta') return 'beta';
  return 'stable';
}
