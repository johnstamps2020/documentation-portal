import IconButton from '@mui/material/IconButton';
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';

type ViewSwitcherProps = {
  listView: boolean;
  setListView: (listView: boolean) => void;
};

export default function ViewSwitcher({
  listView,
  setListView,
}: ViewSwitcherProps) {
  return (
    <IconButton
      aria-label={listView ? 'Switch to card view' : 'Switch to list view'}
      onClick={() => setListView(!listView)}
    >
      {listView ? <GridViewIcon /> : <ListIcon />}
    </IconButton>
  );
}
