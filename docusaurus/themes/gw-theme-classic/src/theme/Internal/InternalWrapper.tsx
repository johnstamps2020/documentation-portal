import { useDocContext } from '@theme/DocContext';
import React, { useState, useEffect } from 'react';

type InternalWrapperProps = {
  children: React.ReactNode;
};

export const hideInternalClassName = 'hideInternalItems';
export const internalNavItemClass = 'internalNavItem';

export default function InternalWrapper({ children }: InternalWrapperProps) {
  const { userInformation } = useDocContext();
  const [hide, setHide] = useState(true);

  useEffect(
    function () {
      if (userInformation?.hasGuidewireEmail === false) {
        setHide(true);
      } else {
        setHide(false);
      }
    },
    [userInformation]
  );

  return (
    <div className={hide ? hideInternalClassName : undefined}>{children}</div>
  );
}
