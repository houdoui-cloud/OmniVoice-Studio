export const LANG_CODES = {
  en: 'English',
  zh: 'Chinese',
  es: 'Spanish',
  ja: 'Japanese',
  de: 'German',
  fr: 'French',
  ko: 'Korean',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
};

export function getLanguageName(code) {
  return LANG_CODES[code] || code;
}
