import useMediaQuery from '@mui/material/useMediaQuery';

export default function useIsMobile() {
  // "996px" is the mobile width according to Docusaurus docs
  // https://docusaurus.io/docs/styling-layout#mobile-view
  return useMediaQuery('(max-width: 996px)');
}
