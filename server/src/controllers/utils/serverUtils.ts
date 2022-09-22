export function runningInDevMode(): boolean {
  return process.env.NODE_ENV === 'development';
}
