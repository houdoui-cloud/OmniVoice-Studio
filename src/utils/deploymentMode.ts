export function deploymentMode(): 'local' | 'web' | 'tauri' | 'docker' {
  if (typeof window !== 'undefined' && (window.__TAURI__ || window.__TAURI_INTERNALS__)) {
    return 'tauri';
  }
  return 'web';
}
