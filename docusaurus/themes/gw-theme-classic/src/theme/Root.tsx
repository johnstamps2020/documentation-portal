import React from "react";
import Head from "@docusaurus/Head";
import { DocContextProvider } from "@theme/DocContext";
import Init from "./Init";
import "./root.css";
import InitialRoot from "@theme-init/Root";
import GwThemeProvider from "./GwThemeProvider";
import { NotificationProvider } from "./NotificationContext/NotificationContext";
import InternalWrapper from "@theme/Internal/InternalWrapper";
import CssBaseline from "@mui/material/CssBaseline";

// Default implementation, that you can customize
type RootProps = { children: JSX.Element | JSX.Element[] | string };

function Root({ children }: RootProps) {
  const faviconEncoded =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEUAAAAAdJ////9qrHgvAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAHdElNRQflChQQMzjf2YYmAAAAJ0lEQVQY02NgIAmIhoIAsYwAmC58DFaYYmIYDAyMhBihoSFEMwgDAC5dG1EV41bhAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTEwLTIwVDE2OjUxOjU0KzAwOjAwtT96EwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0xMC0yMFQxNjo1MTo1NCswMDowMMRiwq8AAAAASUVORK5CYII=";

  return (
    <GwThemeProvider>
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
