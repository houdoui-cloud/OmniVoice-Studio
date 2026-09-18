import { toast } from 'react-hot-toast';

export function showMicDeniedGuide() {
  toast.error('Microphone permission required. Please check your browser permissions.');
}
