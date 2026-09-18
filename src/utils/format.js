export function formatTime(seconds) {
  if (isNaN(seconds) || seconds == null || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function probeAudioDuration(blob) {
  return new Promise((resolve) => {
    if (!blob) {
      resolve(null);
      return;
    }

    let url = '';
    try {
      url = URL.createObjectURL(blob);
    } catch {
      resolve(null);
      return;
    }

    const audio = new Audio();
    const timeout = setTimeout(() => {
      cleanup();
      resolve(null);
    }, 1500);

    function cleanup() {
      clearTimeout(timeout);
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }

    audio.addEventListener('loadedmetadata', () => {
      cleanup();
      const dur = audio.duration;
      resolve(Number.isFinite(dur) ? dur : null);
    });

    audio.addEventListener('error', () => {
      cleanup();
      resolve(null);
    });

    audio.src = url;
  });
}
