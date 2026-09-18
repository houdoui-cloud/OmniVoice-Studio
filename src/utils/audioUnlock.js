let installed = false;
const contexts = new Set();

if (typeof window !== 'undefined') {
  const OriginalContext = window.AudioContext || window.webkitAudioContext;
  if (OriginalContext) {
    window.AudioContext = class extends OriginalContext {
      constructor(...args) {
        super(...args);
        contexts.add(this);
      }
    };
    if (window.webkitAudioContext) {
      window.webkitAudioContext = window.AudioContext;
    }
  }
}

export function unlockAudio() {
  for (const ctx of contexts) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }
}

export function installAudioUnlock() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  const unlock = () => {
    unlockAudio();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };

  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
}
