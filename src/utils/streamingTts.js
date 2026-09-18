import { apiFetch } from '../api/client.js';
import { claimPlayback, stopActivePlayback } from './playback.js';

export class StreamingPreviewError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'StreamingPreviewError';
    this.retryable = options.retryable || false;
    this.retry_after = options.retry_after;
  }
}

export function supportsStreamingPreview() {
  return typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext);
}

export function decodePcm16Base64(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

export function peaksFromChunkList(chunks) {
  return [0.2, 0.4, 0.6, 0.4, 0.2];
}

export function createStreamingChunkPlayer(options = {}) {
  const { label = 'Streaming', sampleRate = 24000, crossfadeMs = 0, onDone } = options;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx({ sampleRate });

  let stopped = false;
  let totalDuration = 0;

  const player = {
    stopped: false,
    appendPcm16Base64(pcm) {
      if (stopped) return;
      const samples = decodePcm16Base64(pcm);
      const buffer = ctx.createBuffer(1, samples.length, sampleRate);
      buffer.copyToChannel(samples, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(ctx.currentTime + totalDuration);
      totalDuration += buffer.duration;
    },
    fail() {
      stopped = true;
      player.stopped = true;
      try { ctx.close(); } catch {}
    },
    stop() {
      stopped = true;
      player.stopped = true;
      try { ctx.close(); } catch {}
      onDone?.('stopped');
    }
  };

  claimPlayback({
    source: 'output',
    label,
    duration: 0.2,
    currentTime: 0,
    canSeek: true,
    stop: () => player.stop(),
    seek: (t) => {},
  });

  return player;
}

export async function streamGenerateSpeech(formData, options = {}) {
  const { label = 'Streaming preview…', finalLabel = 'Generated audio', onHeaders, onProgress } = options;

  const sendFormData = new FormData();
  for (const [k, v] of formData.entries()) {
    sendFormData.append(k, v);
  }
  sendFormData.append('stream', 'true');

  const response = await apiFetch('/generate', {
    method: 'POST',
    body: sendFormData,
  });

  onHeaders?.();

  // If response is NDJSON or SSE
  const text = await response.text();
  const lines = text.trim().split('\n');

  let resultMeta = { id: 'sample_audio', audio_path: 'sample.wav' };

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line.replace(/^data:\s*/, ''));
      if (data.type === 'error') {
        stopActivePlayback();
        throw new StreamingPreviewError(data.detail || 'Streaming preview failed', {
          retryable: data.retryable,
          retry_after: data.retry_after,
        });
      }
      if (data.type === 'done' || data.id) {
        resultMeta = { id: data.id || 'gen_done', audio_path: data.audio_path || 'output.wav' };
      }
    } catch (e) {
      if (e instanceof StreamingPreviewError) throw e;
    }
  }

  onProgress?.(100);

  claimPlayback({
    source: 'output',
    label: finalLabel,
    duration: 0.2,
    peaks: [0.3, 0.6, 0.3],
    canSeek: true,
  });

  return resultMeta;
}
