export const MAX_SEED = 2147483647;

export function pickDesignSeed(keepSeed, pinnedSeed, rng = Math.random) {
  if (keepSeed && Number.isInteger(pinnedSeed) && pinnedSeed >= 0) {
    return pinnedSeed;
  }
  return Math.floor(rng() * MAX_SEED);
}
