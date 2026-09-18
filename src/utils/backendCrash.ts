export interface BackendCrashMarker {
  exit_code: number | null;
  signal: number | null;
  exit_desc?: string;
  backend_version?: string;
  uptime_s?: number;
  ts: number;
  acknowledged: boolean;
  last_stderr?: string;
}

export interface LastRunCrashRecord {
  detected_at: number;
  started_at?: number;
  ended_between?: [number, number];
  uptime_hint_s?: number | null;
  version?: string;
  last_activity?: { ts: number; kind: string; detail?: string } | null;
  log_tail?: string[];
}

let storedCrash: BackendCrashMarker | null = null;

export function _adaptLastRunCrash(
  rec: LastRunCrashRecord,
  acknowledged = false
): BackendCrashMarker {
  let stderr = '';
  if (rec.last_activity) {
    stderr += `last activity before the death: ${rec.last_activity.kind}${rec.last_activity.detail ? ` (${rec.last_activity.detail})` : ''}\n`;
  }
  if (rec.log_tail && rec.log_tail.length > 0) {
    stderr += rec.log_tail.join('\n');
  }

  return {
    exit_code: null,
    signal: null,
    exit_desc: 'process ended uncleanly (previous run)',
    backend_version: rec.version || '',
    uptime_s: rec.uptime_hint_s || 0,
    ts: rec.detected_at,
    acknowledged,
    last_stderr: stderr,
  };
}

export function describeCrashExit(marker: BackendCrashMarker): string {
  if (marker.signal) return `killed by signal ${marker.signal}`;
  if (marker.exit_code !== null) return `exited with code ${marker.exit_code}`;
  return marker.exit_desc || 'process ended uncleanly';
}

export function crashAge(marker: BackendCrashMarker): number {
  return Math.max(0, Math.floor(Date.now() / 1000) - marker.ts);
}

export function recordCrash(marker: BackendCrashMarker): void {
  storedCrash = marker;
}

export async function getLastBackendCrash(): Promise<BackendCrashMarker | null> {
  return storedCrash;
}

export async function getUnacknowledgedBackendCrash(): Promise<BackendCrashMarker | null> {
  if (storedCrash && !storedCrash.acknowledged) return storedCrash;
  return null;
}

export async function acknowledgeBackendCrash(): Promise<void> {
  if (storedCrash) storedCrash.acknowledged = true;
}

export function streamDropError(err: any): Error {
  return new Error(err?.message || 'Stream dropped by backend');
}
