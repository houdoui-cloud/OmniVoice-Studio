export const AEC_NEAR = 1;
export const AEC_FAR = 2;

export function frameFromFloat(input) {
  return new Float32Array(input);
}

export function floatToInt16(arr) {
  const out = new Int16Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const s = Math.max(-1, Math.min(1, arr[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}
