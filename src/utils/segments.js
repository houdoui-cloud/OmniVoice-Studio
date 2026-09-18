export function autoProfileId(speakerId) {
  if (!speakerId) return '';
  return 'auto:' + speakerId.toLowerCase().replace(/\s+/g, '_');
}

export function applySpeakerCloneDefaults(segs, clones) {
  if (!segs || !Array.isArray(segs)) return segs;
  if (!clones || Object.keys(clones).length === 0) return segs;

  return segs.map((seg) => {
    if (!seg.profile_id && seg.speaker_id && clones[seg.speaker_id]) {
      return {
        ...seg,
        profile_id: autoProfileId(seg.speaker_id),
      };
    }
    return seg;
  });
}

export function segmentGenInputs(seg) {
  return {
    text: seg.text || '',
    voice: seg.profile_id || 'default',
    speed: seg.speed || 1.0,
  };
}
