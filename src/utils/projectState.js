export function restoreProjectExtras(project) {
  if (!project) return {};
  return {
    ...project,
    extras: project.extras || {},
  };
}

export function saveProjectExtras(extras) {
  return extras || {};
}
