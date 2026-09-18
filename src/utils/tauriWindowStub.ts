export function getCurrentWindow() {
  return {
    label: 'main',
    listen: () => () => {},
    emit: () => {},
    close: () => {},
    hide: () => {},
    show: () => {},
  };
}

export default {
  getCurrentWindow,
};
