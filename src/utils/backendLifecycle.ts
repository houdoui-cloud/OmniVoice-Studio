export type BackendLifecycle = 'stopped' | 'starting' | 'ready' | 'failed';

export function backendLifecycleStage(): BackendLifecycle {
  return 'ready';
}
