import Button from '@mui/material/Button';
import { useSearchLayoutContext } from './SearchLayoutContext';

export default function AdvancedSearchHelpButton() {
  const { isHelpExpanded, setIsHelpExpanded } = useSearchLayoutContext();

  function handleOpen() {
    setIsHelpExpanded(true);
  }

  function handleClose() {
    setIsHelpExpanded(false);
  }

  return (
    <Button
      onClick={isHelpExpanded ? handleClose : handleOpen}
      sx={{ fontWeight: 400 }}
    >
      {isHelpExpanded
        ? `Hide advanced search help`
        : `Show advanced search help`}
    </Button>
  );
}
