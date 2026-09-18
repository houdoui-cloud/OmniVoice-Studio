import { browserDownload } from './download.js';

export function downloadMedia(url, filename) {
  browserDownload(url, filename);
}
