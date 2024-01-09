import Drawer from '@mui/material/Drawer';
import { useMobile } from 'hooks/useMobile';
import { useSearchLayoutContext } from '../SearchLayoutContext';
import SearchFilterPanel from './SearchFilterPanel';

export default function SearchFilterLayout() {
  const { isMobile } = useMobile();
  const { isShowFiltersExpanded, setIsShowFiltersExpanded } =
    useSearchLayoutContext();

  if (!isMobile) {
    return <SearchFilterPanel />;
  }

  return (
    <Drawer
      open={isShowFiltersExpanded}
      variant="temporary"
      onClose={() => setIsShowFiltersExpanded(false)}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <SearchFilterPanel />
    </Drawer>
  );
}
