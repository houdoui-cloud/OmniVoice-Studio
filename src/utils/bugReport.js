export const REPO_URL = 'https://github.com/houdoui-cloud/OmniVoice-Studio';

export function buildBugReportUrl(error, context = '') {
  const title = encodeURIComponent(`[Bug]: ${error?.message || 'Unexpected Error'}`);
  const body = encodeURIComponent(
    `### Describe the bug\n\n${error?.message || error}\n\n### Context\n${context}\n\n### Stack\n\`\`\`\n${error?.stack || ''}\n\`\`\``
  );
  return `${REPO_URL}/issues/new?title=${title}&body=${body}`;
}

export function buildIssueSearchUrl(error) {
  const q = encodeURIComponent(error?.message || 'error');
  return `${REPO_URL}/issues?q=${q}`;
}
