export async function invoke(cmd: string, args?: any): Promise<any> {
  return null;
}

export async function listen(event: string, handler: (e: any) => void): Promise<() => void> {
  return () => {};
}

export async function emit(event: string, payload?: any): Promise<void> {
  return;
}

export function getCurrentWindow() {
  return {
    label: 'main',
    listen: async () => () => {},
    emit: async () => {},
    close: async () => {},
    hide: async () => {},
    show: async () => {},
    setFocus: async () => {},
    setSize: async () => {},
  };
}

export async function getVersion(): Promise<string> {
  return '0.4.2';
}

export async function getName(): Promise<string> {
  return 'OmniVoice Studio';
}

export default {
  invoke,
  listen,
  emit,
  getCurrentWindow,
  getVersion,
  getName,
};
