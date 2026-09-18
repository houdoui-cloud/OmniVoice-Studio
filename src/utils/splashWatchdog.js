export function startSplashWatchdog(options = {}) {
  // Safe watchdog timer for bootstrap splash
  const timer = setTimeout(() => {
    if (options.onTimeout) {
      options.onTimeout();
    }
  }, options.timeoutMs || 8000);

  return () => clearTimeout(timer);
}

export function startHealthRecoveryPoll(options = {}) {
  let active = true;
  const interval = setInterval(async () => {
    if (!active) return;
    try {
      const res = await fetch('/health');
      if (res.ok && options.onRecover) {
        options.onRecover();
      }
    } catch {}
  }, options.intervalMs || 2500);

  return () => {
    active = false;
    clearInterval(interval);
  };
}
