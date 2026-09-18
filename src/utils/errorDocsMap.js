export const TRANSLATION_ENGINES_DOCS = 'https://github.com/houdoui-cloud/OmniVoice-Studio#translation';

export function classifyError(error) {
  if (!error) return 'general';
  const msg = (error.message || String(error)).toLowerCase();
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('401')) return 'network';
  if (msg.includes('audio') || msg.includes('webaudio')) return 'audio';
  if (msg.includes('mic') || msg.includes('permission')) return 'mic';
  return 'general';
}

export async function openDocsFor(key) {
  if (typeof window !== 'undefined') {
    window.open('https://github.com/houdoui-cloud/OmniVoice-Studio', '_blank');
  }
}
