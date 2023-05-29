import Button from '@mui/material/Button';
import { useMobile } from 'hooks/useMobile';
import { useSearchLayoutContext } from './SearchLayoutContext';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function FilterButton() {
  const { isMobile } = useMobile();
  const { setIsShowFiltersExpanded } = useSearchLayoutContext();

  if (!isMobile) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      onClick={() => setIsShowFiltersExpanded(true)}
      sx={{ width: '100%' }}
      startIcon={<FilterListIcon />}
    >
      Show filters
    </Button>
  );
}
