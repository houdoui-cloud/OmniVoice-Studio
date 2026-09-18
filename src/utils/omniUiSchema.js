export const OMNI_UI_SCHEMA = {
  uiScale: (v) => typeof v === 'number' && v > 0,
  text: (v) => typeof v === 'string',
  mode: (v) => typeof v === 'string',
  defineMethod: (v) => typeof v === 'string',
  vdStates: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
  language: (v) => typeof v === 'string',
  isSidebarCollapsed: (v) => typeof v === 'boolean',
  sidebarTab: (v) => typeof v === 'string',
  dubJobId: (v) => typeof v === 'string' || v === null,
  dubFilename: (v) => typeof v === 'string' || v === null,
  dubDuration: (v) => typeof v === 'number',
  dubSegments: (v) => Array.isArray(v),
  dubLang: (v) => typeof v === 'string',
  dubLangCode: (v) => typeof v === 'string',
  dubTracks: (v) => Array.isArray(v) || typeof v === 'object',
  dubStep: (v) => typeof v === 'string',
  dubTranscript: (v) => typeof v === 'string',
  exportTracks: (v) => Array.isArray(v) || typeof v === 'object',
  preserveBg: (v) => typeof v === 'boolean',
  defaultTrack: (v) => typeof v === 'string',
  exportHistory: (v) => Array.isArray(v),
  speed: (v) => typeof v === 'number',
  steps: (v) => typeof v === 'number',
  cfg: (v) => typeof v === 'number',
  denoise: (v) => typeof v === 'number' || typeof v === 'boolean',
  showOverrides: (v) => typeof v === 'boolean',
};

export function sanitizeOmniUi(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const out = {};
  for (const [key, val] of Object.entries(input)) {
    const validator = OMNI_UI_SCHEMA[key];
    if (!validator) {
      console.warn(`[sanitizeOmniUi] Dropping unknown key '${key}'`);
      continue;
    }
    if (validator(val)) {
      out[key] = val;
    } else {
      console.warn(`[sanitizeOmniUi] Dropping invalid value for key '${key}'`);
    }
  }
  return out;
}
