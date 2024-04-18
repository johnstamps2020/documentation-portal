export function isPublicBuild(): boolean {
  return process.env.PUBLIC === 'true';
}
