import { mainHeight } from 'components/Layout/Layout';

export const baseBackgroundProps = {
  backgroundAttachment: 'fixed',
  backgroundPosition: 'bottom-right',
  backgroundSize: 'cover',
  minHeight: mainHeight,
};

export type LandingPageProps = {
  title: string;
};

export type LandingPageLayoutProps = {
  backgroundProps: {
    backgroundImage?: any;
    backgroundColor?: string;
    backgroundAttachment: string;
    backgroundPosition: string;
    backgroundSize: string;
    minHeight: string;
  };
  sidebar?: SidebarProps;
};

export type LandingPageItemProps = {
  label?: string;
  docId?: string;
  pagePath?: string;
  url?: string;
};

export type SidebarProps = {
  label: string;
  items: LandingPageItemProps[];
};
