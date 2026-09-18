export function initAnalyticsFromConsent() {
  // Respects user privacy
}

export function enableAnalytics() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ov_analytics_opt_in', 'true');
  }
}

export function disableAnalytics() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ov_analytics_opt_in', 'false');
  }
}

export function trackEvent(name, props) {
  // Analytics event tracking stub
}
