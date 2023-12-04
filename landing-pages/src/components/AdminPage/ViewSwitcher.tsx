import IconButton from '@mui/material/IconButton';
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import { useAdminViewContext } from './AdminViewContext';

export default function ViewSwitcher() {
  const { listView, setListView } = useAdminViewContext();

  return (
    <IconButton
      aria-label={listView ? 'Switch to card view' : 'Switch to list view'}
      onClick={() => setListView(!listView)}
    >
      {listView ? <GridViewIcon /> : <ListIcon />}
    </IconButton>
  );
}
