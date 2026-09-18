export async function openUrl(url: string): Promise<void> {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export async function openPath(path: string): Promise<void> {
  return;
}

export async function revealItemInDir(path: string): Promise<void> {
  return;
}

export async function open(options?: any): Promise<any> {
  return null;
}

export async function save(options?: any): Promise<any> {
  return null;
}

export async function ask(message: string, options?: any): Promise<boolean> {
  return false;
}

export async function message(message: string, options?: any): Promise<void> {
  return;
}

export async function confirm(message: string, options?: any): Promise<boolean> {
  return false;
}

export async function exit(code?: number): Promise<void> {
  return;
}

export async function relaunch(): Promise<void> {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

export default {
  openUrl,
  openPath,
  revealItemInDir,
  open,
  save,
  ask,
  message,
  confirm,
  exit,
  relaunch,
};
