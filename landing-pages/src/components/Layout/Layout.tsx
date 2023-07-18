import Header, { headerHeight } from './Header/Header';
import Footer from './Footer';
import Box from '@mui/material/Box';
import { useLayoutContext } from 'LayoutContext';
import { Outlet } from 'react-router-dom';

export const mainHeight = `calc(100vh - ${headerHeight})`;

export type HeaderOptions = {
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
  hideUserProfile?: boolean;
};


export default function Layout() {
  const { title, headerOptions, backgroundColor, path } = useLayoutContext();
  document.title = `${title} | Guidewire Documentation`;
  return (
    <div>
      <Header {...headerOptions} />
      <main style={{ backgroundColor }}>
        <Box
          sx={{
            minHeight: { xs: 'auto', sm: mainHeight },
          }}
        >
          <Outlet />
        </Box>
      </main>
      <Footer path={path} />
    </div>
  );
}
