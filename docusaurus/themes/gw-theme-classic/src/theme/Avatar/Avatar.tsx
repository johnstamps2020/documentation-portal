import React, { useState, useEffect } from 'react';
import { useDocContext } from '@theme/DocContext';
import { Avatar as DoctoolsAvatar } from '@doctools/core';

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

  return (
    <DoctoolsAvatar
      initialValue={{
        userInfo,
        isProd: docContext.isProd,
      }}
    />
  );
}
