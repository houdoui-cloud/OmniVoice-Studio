import { Mic, User, Sparkles, Volume2, Radio, Headphones } from 'lucide-react';

export const FALLBACK_VOICE_ICON = Mic;
export const FALLBACK_PERSONALITY_ICON = Sparkles;

export const DEMO_ICONS = {
  narrator: Headphones,
  storyteller: Sparkles,
  assistant: Volume2,
  news: Radio,
  casual: User,
};

export const PRESET_ICONS = DEMO_ICONS;
export const PERSONALITY_ICONS = DEMO_ICONS;

export function stripVoiceEmoji(name = '') {
  if (!name) return '';
  return name.replace(/^[\p{Emoji}\s]+/u, '').trim();
}
