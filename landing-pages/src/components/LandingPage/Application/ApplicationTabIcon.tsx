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

function getIconImage(icon: ApplicationTabIconProps['icon']) {
  switch (icon) {
    case 'get-started':
      return getStarted;
    case 'learn-about':
      return learnAbout;
    case 'configure':
      return configure;
    case 'integrate':
      return integrate;
    case 'administer':
      return administer;
    default:
      return null;
  }
}

export default function ApplicationTabIcon({
  icon,
}: ApplicationTabIconProps): JSX.Element | null {
  const iconImage = getIconImage(icon);

  if (!iconImage) {
    return null;
  }

  return <img src={iconImage} alt="" />;
}
