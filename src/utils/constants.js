export const CLONE_MAX_SECONDS = 30;

export const POPULAR_LANGS = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (Mandarin)' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];

export const POPULAR_ISO = ['en', 'zh', 'es', 'ja', 'de', 'fr', 'ko', 'it', 'pt', 'ru'];

export const TAGS = [
  'narrator', 'storyteller', 'friendly', 'whisper', 'dramatic',
  'casual', 'energetic', 'calm', 'news', 'warm', 'authoritative',
];

export const CATEGORIES = {
  Gender: ['Auto', 'Male', 'Female', 'Neutral'],
  Age: ['Auto', 'Child', 'Youth', 'Adult', 'Senior'],
  Pitch: ['Auto', 'Low', 'Medium', 'High'],
  Speed: ['Auto', 'Slow', 'Normal', 'Fast'],
  Tone: ['Auto', 'Warm', 'Bright', 'Gravelly', 'Crisp'],
};

export const PRESETS = [
  { id: 'narrator', name: 'Audiobook Narrator', description: 'Deep, clear, engaging tone' },
  { id: 'storyteller', name: 'Fantasy Storyteller', description: 'Dramatic and expressive' },
  { id: 'assistant', name: 'Smart Assistant', description: 'Crisp, articulate and polite' },
  { id: 'news', name: 'News Anchor', description: 'Formal, authoritative delivery' },
  { id: 'casual', name: 'Casual Conversation', description: 'Relaxed, natural rhythm' },
];
