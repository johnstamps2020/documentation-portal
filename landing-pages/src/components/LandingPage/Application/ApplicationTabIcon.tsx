import Box from '@mui/material/Box';
import administer from './icons/administer.svg';
import configure from './icons/configure.svg';
import getStarted from './icons/get-started.svg';
import integrate from './icons/integrate.svg';
import learnAbout from './icons/learn-about.svg';

export type ApplicationTabIconProps = {
  icon:
    | 'get-started'
    | 'learn-about'
    | 'configure'
    | 'integrate'
    | 'administer';
};

function IconImageComponent({ src }: { src: string }) {
  return (
    <Box>
      <img src={src} alt="" />
    </Box>
  );
}

export default function ApplicationTabIcon({
  icon,
}: ApplicationTabIconProps): JSX.Element | null {
  switch (icon) {
    case 'get-started':
      return <IconImageComponent src={getStarted} />;
    case 'learn-about':
      return <IconImageComponent src={learnAbout} />;
    case 'configure':
      return <IconImageComponent src={configure} />;
    case 'integrate':
      return <IconImageComponent src={integrate} />;
    case 'administer':
      return <IconImageComponent src={administer} />;
    default:
      return null;
  }
}
