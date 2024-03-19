import Head from '@docusaurus/Head';
import '@fontsource/source-sans-pro';
import CssBaseline from '@mui/material/CssBaseline';
import InitialRoot from '@theme-init/Root';
import { DocContextProvider } from '@theme/DocContext';
import InternalWrapper from '@theme/Internal/InternalWrapper';
import React, { useEffect, useState } from 'react';
import GwThemeProvider from './GwThemeProvider';
import Init from './Init';
import { NotificationProvider } from './NotificationContext/NotificationContext';
import OverlayLoader from './OverlayLoader';
import './root.css';

// Default implementation, that you can customize
type RootProps = { children: JSX.Element | JSX.Element[] | string };

const faviconEncoded =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEUAAAAAdJ////9qrHgvAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAHdElNRQflChQQMzjf2YYmAAAAJ0lEQVQY02NgIAmIhoIAsYwAmC58DFaYYmIYDAyMhBihoSFEMwgDAC5dG1EV41bhAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTEwLTIwVDE2OjUxOjU0KzAwOjAwtT96EwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0xMC0yMFQxNjo1MTo1NCswMDowMMRiwq8AAAAASUVORK5CYII=';

function Root({ children }: RootProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.fonts.load('12px Source Sans Pro').then(() => setMounted(true));
  }, []);

  return (
    <GwThemeProvider>
      {!mounted && <OverlayLoader />}
      <CssBaseline />
      <NotificationProvider>
        <InitialRoot>
          <DocContextProvider>
            <InternalWrapper>
              <Init>
                <Head>
                  <link rel="icon" type="image/png" href={faviconEncoded} />
                </Head>
                {children}
              </Init>
            </InternalWrapper>
          </DocContextProvider>
        </InitialRoot>
      </NotificationProvider>
    </GwThemeProvider>
  );
}

export default Root;
