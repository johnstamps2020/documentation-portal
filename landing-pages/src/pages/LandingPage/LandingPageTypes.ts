import { mainHeight } from 'components/Layout/Layout';
import React from 'react';

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
  pathInDoc?: string;
  pagePath?: string;
  url?: string;
  videoIcon?: boolean;
  description?: React.ReactNode;
};

export type SidebarProps = {
  label: string;
  items: LandingPageItemProps[];
};
