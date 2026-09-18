import { CATEGORIES } from './constants.js';

export function buildDesignInstruct(vdStates = {}) {
  const parts = [];
  for (const [key, val] of Object.entries(vdStates)) {
    if (val && val !== 'Auto') {
      parts.push(`${key}: ${val}`);
    }
  }
  return parts.join(', ');
}

export function designModeProfileId(id) {
  return id || 'custom_design';
}

export function mergeDescribedAttrs(attrs = {}) {
  const result = {};
  for (const key of Object.keys(CATEGORIES)) {
    result[key] = attrs[key] || 'Auto';
  }
  return result;
}

export function instructToFormValue(val) {
  return val || 'Auto';
}
