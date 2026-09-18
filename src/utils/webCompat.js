// Web-platform gap fills
if (typeof window !== 'undefined') {
  if (!window.CSS) window.CSS = {};
  if (!window.CSS.supports) window.CSS.supports = () => false;
}
export default {};
