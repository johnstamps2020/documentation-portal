import React, { useState, useEffect } from 'react';
import { useDocContext } from '@theme/DocContext';
import DropdownFrame from '../DropdownFrame';
import Button from '@mui/material/Button';
import AvatarDropdown from './AvatarDropdown';
import AvatarButton from './AvatarButton';

export default function Avatar() {
  const docContext = useDocContext();
  const [userInfo, setUserInfo] = useState(undefined);

  useEffect(
    function () {
      if (docContext.userInformation) {
        setUserInfo(docContext.userInformation);
      }
    },
    [docContext]
  );

  if (userInfo?.isLoggedIn) {
    return (
      <DropdownFrame button={<AvatarButton />}>
        <AvatarDropdown />
      </DropdownFrame>
    );
  }

  return (
    <Button href="/gw-login" variant="contained">
      Log in
    </Button>
  );
}
