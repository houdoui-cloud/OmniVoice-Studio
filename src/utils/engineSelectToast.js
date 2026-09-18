import toast from 'react-hot-toast';

export function notifyEngineSelected(response) {
  if (response?.routing_status === 'cpu_fallback') {
    toast('Switched to CPU engine fallback', { icon: '⚠️' });
  } else if (response?.active) {
    toast.success(`Engine selected: ${response.active}`);
  }
}
