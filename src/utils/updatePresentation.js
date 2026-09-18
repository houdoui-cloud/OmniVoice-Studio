export function prepareReleases(releases = []) {
  if (!Array.isArray(releases)) return [];
  return releases.map((rel) => ({
    tag_name: rel.tag_name || 'v0.4.2',
    name: rel.name || rel.tag_name || 'v0.4.2',
    body: rel.body || '',
    published_at: rel.published_at || new Date().toISOString(),
    html_url: rel.html_url || 'https://github.com/houdoui-cloud/OmniVoice-Studio/releases',
  }));
}
