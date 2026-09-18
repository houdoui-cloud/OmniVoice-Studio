const logs = [];
const MAX_LOGS = 200;

export function installConsoleCapture() {
  if (typeof window === 'undefined' || window.__consoleCaptureInstalled) return;
  window.__consoleCaptureInstalled = true;

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => {
    logs.push({ level: 'info', time: Date.now(), msg: args.map(String).join(' ') });
    if (logs.length > MAX_LOGS) logs.shift();
    originalLog(...args);
  };

  console.warn = (...args) => {
    logs.push({ level: 'warn', time: Date.now(), msg: args.map(String).join(' ') });
    if (logs.length > MAX_LOGS) logs.shift();
    originalWarn(...args);
  };

  console.error = (...args) => {
    logs.push({ level: 'error', time: Date.now(), msg: args.map(String).join(' ') });
    if (logs.length > MAX_LOGS) logs.shift();
    originalError(...args);
  };
}

export function getFrontendLogs() {
  return [...logs];
}

export function clearFrontendLogs() {
  logs.length = 0;
}
