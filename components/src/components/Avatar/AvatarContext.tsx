import { LinkProps } from '@mui/material/Link';
import React, { createContext, useContext, useState } from 'react';
import { UserInformation } from '../../lib';

export interface AvatarInterface {
  userInfo: UserInformation;
  isProd: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => void;
  LinkComponent: LinkProps['component'];
}

export type AvatarInitialValue = {
  userInfo: AvatarInterface['userInfo'];
  isProd: AvatarInterface['isProd'];
  LinkComponent?: AvatarInterface['LinkComponent'];
};

export const AvatarContext = createContext<AvatarInterface | null>(null);

type AvatarProviderProps = {
  initialValue: AvatarInitialValue;
  children: React.ReactNode;
};

export function AvatarProvider({
  children,
  initialValue,
}: AvatarProviderProps) {
  const [userInfo, setUserInfo] = useState<AvatarInterface['userInfo']>(
    initialValue.userInfo
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AvatarContext.Provider
      value={{
        ...initialValue,
        drawerOpen,
        setDrawerOpen,
        LinkComponent: initialValue.LinkComponent || 'a',
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
