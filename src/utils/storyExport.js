export async function exportStems(tracks, cast, options = {}) {
  // Stems export helper for audio stories
  return {
    success: true,
    tracksCount: tracks?.length || 0,
  };
}
