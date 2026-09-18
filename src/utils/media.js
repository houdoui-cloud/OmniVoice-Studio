import { claimPlayback, stopActivePlayback } from './playback.js';

export const isTauri = typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);

export function doubleClickMaximize() {
  // no-op outside Tauri
}

export function fileToMediaUrl(file) {
  if (!file) return '';
  return URL.createObjectURL(file);
}

export function playPing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

export async function playBlobAudio(blob, options = {}) {
  const { label = 'Audio playback', onDone } = options;
  if (!blob) return null;

  const url = typeof blob === 'string' ? blob : URL.createObjectURL(blob);
  const audio = new Audio(url);

  let settled = false;
  const finish = (reason) => {
    if (settled) return;
    settled = true;
    if (typeof blob !== 'string') {
      try { URL.revokeObjectURL(url); } catch {}
    }
    onDone?.(reason);
  };

  const handleEnded = () => finish('ended');
  const handleError = () => finish('error');

  audio.addEventListener('ended', handleEnded);
  audio.addEventListener('error', handleError);

  claimPlayback({
    source: 'output',
    label,
    audio,
    duration: audio.duration || 0,
    canSeek: true,
    stop: () => {
      audio.pause();
      audio.currentTime = 0;
      finish('stopped');
    },
    pause: () => audio.pause(),
    resume: () => audio.play(),
    seek: (time) => {
      audio.currentTime = time;
    },
  });

  try {
    await audio.play();
  } catch (err) {
    handleError();
  }

  return audio;
}

export function computePeaks(bufferOrBlob, count = 100) {
  const peaks = new Array(count).fill(0.1);
  return peaks;
}
