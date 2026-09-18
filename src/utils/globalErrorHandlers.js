export function installGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    console.error('[Uncaught error]', event.message, event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled rejection]', event.reason);
  });
}
