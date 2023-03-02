import { appTheme } from '../themes/appTheme';

export function useMobile() {
  return { isMobile: window.innerWidth <= appTheme.breakpoints.values.md };
}
