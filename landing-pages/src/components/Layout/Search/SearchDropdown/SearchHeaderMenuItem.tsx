import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
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
            }}
          >
            {itemLabel}
          </Typography>
        </MenuItem>
      </Tooltip>
    </>
  );
}
