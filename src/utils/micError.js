export function detectPlatform() {
  if (typeof navigator === 'undefined') return 'linux';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) return 'darwin';
  if (ua.includes('win')) return 'win32';
  return 'linux';
}

export function micHintKey(platform) {
  return `mic.hint.${platform || 'linux'}`;
}

export function describeMicError(err) {
  return {
    kind: 'mic',
    message: micErrorMessage(err),
  };
}

export function micErrorMessage(err) {
  if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
    return 'Microphone permission was denied. Please allow microphone access in your browser settings.';
  }
  if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
    return 'No microphone found on this device.';
  }
  return err?.message || 'Unable to access microphone.';
}
