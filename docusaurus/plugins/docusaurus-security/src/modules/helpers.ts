export function isPublicBuild(): boolean {
  return process.env.RESTRICTED !== 'true';
}
