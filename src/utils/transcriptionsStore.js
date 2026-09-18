export const TRANSCRIPTIONS_KEY = 'ov_transcriptions';
export const TRANSCRIPTION_EVENT = 'ov:transcription';

export function loadTranscriptions() {
  try {
    const raw = localStorage.getItem(TRANSCRIPTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
