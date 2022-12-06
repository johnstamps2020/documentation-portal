import { CssBaseline } from "@mui/material";
import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer";

export type SearchBoxOptions = {
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
};

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  searchBoxOptions?: SearchBoxOptions;
  path?: string;
};

export default function Layout({
  children,
  title,
  searchBoxOptions
}: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;
  return (
    <div>
      <CssBaseline enableColorScheme />
      <Header {...searchBoxOptions} />
      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
