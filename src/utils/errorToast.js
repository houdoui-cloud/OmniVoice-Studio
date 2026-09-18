import { toast } from 'react-hot-toast';

export function toastErrorWithReport(err, defaultMsg = 'An error occurred') {
  const msg = err?.message || String(err || defaultMsg);
  toast.error(msg);
}
