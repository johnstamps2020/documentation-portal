import { Translate } from '@doctools/components';
import React, { useEffect, useState } from 'react';

const RestrictedPage = () => {
  const [loginLink, setLoginLink] = useState('/gw-login');

  useEffect(() => {
    setLoginLink(`/gw-login?redirectTo=${window.location.pathname}`);
  }, []);

  return (
    <div>
      <Translate id="restricted.page.info">
        You have to be logged in to view this page.
      </Translate>{' '}
      <a href={loginLink}>
        <Translate id="restricted.page.action">Click here to log in.</Translate>
      </a>
    </div>
  );
};

export default RestrictedPage;
