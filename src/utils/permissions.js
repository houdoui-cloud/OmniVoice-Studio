export const inTauri = typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);

export async function checkMicrophone() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return 'unavailable';
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return 'granted';
  } catch {
    return 'denied';
  }
}

export async function checkAccessibility() {
  return 'granted';
}

export async function openMicrophoneSettings() {
  return false;
}

export async function openAccessibilitySettings() {
  return false;
}
