export const isTauriContext = (): boolean =>
  typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);

export const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export const getApiBase = (): string => API_BASE;
