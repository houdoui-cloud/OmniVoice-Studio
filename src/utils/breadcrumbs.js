const crumbs = [];

export function addBreadcrumb(category, message, data = {}) {
  crumbs.push({ timestamp: Date.now(), category, message, data });
  if (crumbs.length > 100) crumbs.shift();
}

export function getBreadcrumbs() {
  return [...crumbs];
}

export function clearBreadcrumbs() {
  crumbs.length = 0;
}
