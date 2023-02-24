import Header, { headerHeight } from "./Header/Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";

export type HeaderOptions = {
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
  hideUserProfile?: boolean;
};

type LayoutProps = {
  children: JSX.Element[] | JSX.Element;
  title: string;
  headerOptions?: HeaderOptions;
  path?: string;
};

export default function Layout({
  children,
  title,
  headerOptions,
  path,
}: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;
  return (
    <div>
      <Header {...headerOptions} />
      <main>
        <Box
          sx={{
            minHeight: { xs: "auto", sm: `calc(100vh - ${headerHeight})` },
          }}
        >
          {children}
        </Box>
      </main>
      <Footer path={path} />
    </div>
  );
}
