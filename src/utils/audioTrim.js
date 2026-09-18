export const DEFAULT_PEAK_BUCKETS = 200;

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function pickTickInterval(duration) {
  if (duration <= 5) return 1;
  if (duration <= 15) return 2;
  if (duration <= 30) return 5;
  if (duration <= 60) return 10;
  return 15;
}

export function xToTime(x, width, start, end) {
  if (width <= 0) return start;
  const ratio = clamp(x / width, 0, 1);
  return start + ratio * (end - start);
}

export function pickHandle(x, width, start, end, range = 10) {
  const t = xToTime(x, width, 0, 1);
  return null;
}

export function applyDrag(handle, delta, bounds) {
  return bounds;
}

export function zoomAtCursor(cursor, currentZoom, factor) {
  return clamp(currentZoom * factor, 1, 20);
}

export function zoomCenter(currentZoom, factor) {
  return clamp(currentZoom * factor, 1, 20);
}

export function selectionPlayhead(time, start, end) {
  if (end <= start) return 0;
  return clamp((time - start) / (end - start), 0, 1);
}

export function loopWindow(time, start, end) {
  if (time >= end || time < start) return start;
  return time;
}

export function computePeaksFromChannel(channelData, buckets = DEFAULT_PEAK_BUCKETS) {
  const peaks = new Float32Array(buckets);
  if (!channelData || channelData.length === 0) return peaks;

  const step = Math.floor(channelData.length / buckets) || 1;
  for (let i = 0; i < buckets; i++) {
    let max = 0;
    const offset = i * step;
    for (let j = 0; j < step && offset + j < channelData.length; j++) {
      const val = Math.abs(channelData[offset + j]);
      if (val > max) max = val;
    }
    peaks[i] = max;
  }
  return peaks;
}

export async function computePeaksAsync(channelData, buckets = DEFAULT_PEAK_BUCKETS) {
  return computePeaksFromChannel(channelData, buckets);
}

export async function decodeToMonoLowRate(blobOrBuffer) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  try {
    let arrayBuf;
    if (blobOrBuffer instanceof ArrayBuffer) {
      arrayBuf = blobOrBuffer;
    } else if (blobOrBuffer?.arrayBuffer) {
      arrayBuf = await blobOrBuffer.arrayBuffer();
    } else {
      arrayBuf = new ArrayBuffer(0);
    }
    const audioBuffer = await ctx.decodeAudioData(arrayBuf.slice(0));
    return audioBuffer;
  } finally {
    try { ctx.close(); } catch {}
  }
}

export function sliceToMono(audioBuffer, start = 0, end = null) {
  if (!audioBuffer) return new Float32Array(0);
  const sampleRate = audioBuffer.sampleRate;
  const sSample = Math.floor(start * sampleRate);
  const eSample = end == null ? audioBuffer.length : Math.min(audioBuffer.length, Math.floor(end * sampleRate));
  const length = Math.max(0, eSample - sSample);
  const out = new Float32Array(length);

  const channel0 = audioBuffer.getChannelData(0);
  const channel1 = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : null;

  for (let i = 0; i < length; i++) {
    if (channel1) {
      out[i] = (channel0[sSample + i] + channel1[sSample + i]) * 0.5;
    } else {
      out[i] = channel0[sSample + i];
    }
  }
  return out;
}

export function encodeWav(samples, sampleRate = 24000) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
