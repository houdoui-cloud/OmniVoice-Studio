let contactTime = 0;

export function lastBackendContact(): number {
  return contactTime;
}

export function recordBackendContact(): void {
  contactTime = Date.now();
}

export function unreachableBackendMessage(mode?: string): string {
  if (mode === 'dev') {
    return "The backend may be auto-reloading or stopped. Please retry in a moment. Check 'bun run dev' terminal or omnivoice.log if it persists.";
  }
  if (mode === 'server') {
    return 'Cannot reach the backend. Check docker logs or journalctl for details.';
  }
  return 'Cannot reach the local OmniVoice backend. Please ensure the backend is running.';
}
