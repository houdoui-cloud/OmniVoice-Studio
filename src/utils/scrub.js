export function scrubText(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/(hf_[A-Za-z0-9]{20,})/g, 'hf_***')
    .replace(/(Bearer\s+)[A-Za-z0-9_.-]+/g, '$1***')
    .replace(/(api_key=)[^&\s]+/g, '$1***');
}
