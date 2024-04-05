import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

type SearchHeaderMenuItemProps = {
  itemKey: string;
  tooltipTitle: string;
  itemLabel: string;
  menuItemSx?: {};
  selected: boolean;
  handleClick: (() => void) | ((event: any) => void);
};

export default function SearchHeaderMenuItem({
  itemKey,
  tooltipTitle,
  itemLabel,
  menuItemSx,
  selected,
  handleClick,
}: SearchHeaderMenuItemProps) {
  return (
    <Tooltip
      key={itemKey}
      title={<Typography>{tooltipTitle}</Typography>}
      placement="left"
      enterDelay={500}
      arrow
    >
      <MenuItem
        sx={{
          p: '2px 13px',
          ...menuItemSx,
        }}
        onClick={handleClick}
        selected={selected}
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
  );
}
