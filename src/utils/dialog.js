export async function askConfirm(message, options = {}) {
  if (typeof window !== 'undefined' && window.confirm) {
    return window.confirm(message);
  }
  return true;
}

export async function showDialog(options) {
  return true;
}
