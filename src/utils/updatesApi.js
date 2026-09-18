export async function fetchChangelog() {
  return '# OmniVoice Studio Changelog\n\n- Version 0.4.2: Web & Cloud Run compatibility updates\n- Neural voice synthesis with real-time waveform controls\n- Multi-engine TTS & ASR support';
}

export async function fetchBackupState() {
  return { hasBackup: true, lastBackupTime: new Date().toISOString() };
}
