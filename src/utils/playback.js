import { useState, useEffect } from 'react';

let currentTrack = null;
const listeners = new Set();

export function claimPlayback(track) {
  if (currentTrack && currentTrack.stop) {
    try { currentTrack.stop(); } catch {}
  }
  currentTrack = track;
  notify();
  return track;
}

export function getPlaybackTrack() {
  return currentTrack;
}

export function stopActivePlayback() {
  if (currentTrack && currentTrack.stop) {
    try { currentTrack.stop(); } catch {}
  }
  currentTrack = null;
  notify();
}

export function pauseActivePlayback() {
  if (currentTrack && currentTrack.pause) {
    try { currentTrack.pause(); } catch {}
  }
  notify();
}

export function resumeActivePlayback() {
  if (currentTrack && currentTrack.resume) {
    try { currentTrack.resume(); } catch {}
  }
  notify();
}

export function seekActivePlayback(time) {
  if (currentTrack && currentTrack.seek) {
    try { currentTrack.seek(time); } catch {}
  }
  notify();
}

export function subscribePlayback(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) {
    try { fn(currentTrack); } catch {}
  }
}

export function usePlaybackTrack() {
  const [track, setTrack] = useState(currentTrack);
  useEffect(() => {
    return subscribePlayback(setTrack);
  }, []);
  return track;
}

export function usePlaybackSource(source) {
  return currentTrack && currentTrack.source === source ? currentTrack : null;
}
