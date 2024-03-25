import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import { translate } from '@doctools/components';

type SearchHeaderButtonProps = {
  searchBoxRef: React.RefObject<HTMLInputElement | undefined>;
  focusSearchBox: () => void;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  children: any;
};
export default function SearchHeaderButton({
  searchBoxRef,
  focusSearchBox,
  handleClick,
  children,
}: SearchHeaderButtonProps) {
  const { state } = useSearchHeaderLayoutContext();

  let numFilters =
    (state.searchFilters.release?.length
      ? state.searchFilters.release.length
      : 0) +
    (state.searchFilters.product?.length
      ? state.searchFilters.product.length
      : 0);

  const buttonText = translate({
    id: 'search.filter.menu.button',
    message: 'Filter',
  });

  if (!state.defaultFilters.release) {
    return null;
  }

  return (
    <Button
      id="search-menu-button"
      onClick={handleClick}
      aria-controls={state.isMenuExpanded ? 'search-dropdown-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={state.isMenuExpanded ? 'true' : undefined}
      variant="outlined"
      disableElevation
      endIcon={
        <ArrowDropDownIcon
          sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '24px !important' }}
        />
      }
      sx={{
        bgcolor: 'white',
        color: 'black',
        textTransform: 'none',
        p: '2px 4px 2px 13px',
        marginRight: '1rem',
        '&:hover': {
          bgcolor: '#E9E9E9', // TODO better way to approximate color? alphas don't work here
        },
      }}
    >
      {buttonText} ({numFilters}){children}
    </Button>
  );
}
