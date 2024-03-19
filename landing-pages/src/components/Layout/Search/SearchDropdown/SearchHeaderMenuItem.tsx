import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import Tooltip from '@mui/material/Tooltip';

type SearchHeaderMenuItemProps = {
  itemKey: string;
  tooltipTitle: string;
  handleClick: (() => void) | ((event: any) => void);
  itemLabel: string;
  menuItemSx?: {};
};

export default function SearchHeaderMenuItem({
  itemKey,
  tooltipTitle,
  itemLabel,
  menuItemSx,
  handleClick,
}: SearchHeaderMenuItemProps) {
  const { isMenuExpanded } = useSearchHeaderLayoutContext();

  return (
    <>
      <Tooltip
        key={itemKey}
        title={tooltipTitle}
        placement="right"
        enterDelay={500}
        arrow
      >
        <MenuItem
          sx={{
            p: '2px 13px',
            ...menuItemSx,
          }}
          onClick={handleClick}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: { isMenuExpanded } ? '500px' : '200px',
            }}
          >
            {itemLabel}
          </Typography>
        </MenuItem>
      </Tooltip>
    </>
  );
}
