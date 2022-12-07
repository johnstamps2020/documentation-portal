import { CssBaseline } from "@mui/material";
import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer";

export type HeaderOptions = {
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
};

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  headerOptions?: HeaderOptions;
  path?: string;
};

export default function Layout({
  children,
  title,
  headerOptions,
  path
}: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;
  return (
    <div>
      <CssBaseline enableColorScheme />
      <Header {...headerOptions} />
      <main>{children}</main>
      <Footer path={path} title={title} />
    </div>
  );
}
