import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { useAdminViewContext } from './AdminViewContext';

type EntityListCountProps = {
  totalEntities: number;
};

export default function EntityListCount({
  totalEntities,
}: EntityListCountProps) {
  const { filteredEntities } = useAdminViewContext();
  return (
    <Divider variant="middle" sx={{ margin: '20px' }}>
      <Chip
        label={
          filteredEntities.length === totalEntities
            ? `Displaying all ${totalEntities} entities`
            : `Based on the filters, displaying ${filteredEntities.length} out of ${totalEntities}`
        }
        color={
          filteredEntities.length === totalEntities ? 'default' : 'primary'
        }
      />
    </Divider>
  );
}
