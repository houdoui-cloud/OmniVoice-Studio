import { toast } from 'react-hot-toast';

export function asrMissingPayload() {
  return { missing: true };
}

export function toastAsrModelMissing() {
  toast.error('Whisper transcription model is not installed.');
}
