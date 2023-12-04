import IconButton from '@mui/material/IconButton';
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import { useAdminViewContext } from './AdminViewContext';
import Tooltip from '@mui/material/Tooltip';

export default function ViewSwitcher() {
  const { listView, setListView } = useAdminViewContext();
  const label = listView ? 'Switch to card view' : 'Switch to list view';

  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={() => setListView(!listView)}>
        {listView ? <GridViewIcon /> : <ListIcon />}
      </IconButton>
    </Tooltip>
  );
}
