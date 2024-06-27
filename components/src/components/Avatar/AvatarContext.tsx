import { LinkProps } from '@mui/material/Link';
import React, { createContext, useContext, useState } from 'react';
import { UserInformation } from '../../lib';

export interface AvatarInterface {
  userInfo: UserInformation;
  isProd: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => void;
  LinkComponent: LinkProps['component'];
  additionalLinks: {
    href: string;
    label: string;
  }[];
}

export type AvatarInitialValue = {
  userInfo: AvatarInterface['userInfo'];
  isProd: AvatarInterface['isProd'];
  LinkComponent?: AvatarInterface['LinkComponent'];
  additionalLinks?: AvatarInterface['additionalLinks'];
};

export const AvatarContext = createContext<AvatarInterface | null>(null);

type AvatarProviderProps = {
  initialValue: AvatarInitialValue;
  children: React.ReactNode;
};

function handleLinks(userInfo: UserInformation, isProd: boolean) {
  if (isProd) {
    return { userLinks: [] };
  }

  if (!userInfo?.isAdmin && !userInfo?.isPowerUser) {
    return { userLinks: [] };
  }

  if (userInfo.isAdmin) {
    return {
      userLinks: [
        {
          href: '/admin-panel/page',
          label: 'Admin panel',
        },
        {
          href: '/delta-doc',
          label: 'Doc Delta Tool',
        },
      ],
    };
  } else {
    return { userLinks: [{ href: '/delta-doc', label: 'Doc Delta Tool' }] };
  }
}

export function AvatarProvider({
  children,
  initialValue,
}: AvatarProviderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userLinks } = handleLinks(initialValue.userInfo, initialValue.isProd);

  return (
    <AvatarContext.Provider
      value={{
        ...initialValue,
        drawerOpen,
        setDrawerOpen,
        LinkComponent: initialValue.LinkComponent || 'a',
        additionalLinks: userLinks,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
