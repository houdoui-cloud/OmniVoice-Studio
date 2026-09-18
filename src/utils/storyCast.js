const CAST_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export function nextCastColor(cast = []) {
  return CAST_COLORS[cast.length % CAST_COLORS.length];
}

export function castMember(cast = [], characterId) {
  if (!cast || !characterId) return null;
  return cast.find((c) => c.id === characterId) || null;
}

export function effectiveProfile(track, cast = []) {
  if (track?.profileId) return track.profileId;
  const member = castMember(cast, track?.character);
  return member?.profileId || 'aria';
}

export function effectiveSpeed(track, cast = []) {
  if (track?.speed != null) return track.speed;
  const member = castMember(cast, track?.character);
  return member?.speed != null ? member.speed : 1.0;
}
