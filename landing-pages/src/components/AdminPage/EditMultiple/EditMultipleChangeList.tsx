import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAdminViewContext } from '../AdminViewContext';
import ChangeListDetailsButton from './ChangeListDetailsButton';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleDiffTable from './EditMultipleDiffTable';

export default function EditMultipleChangeList() {
  const { entityDiffList } = useEditMultipleContext();
  const { selectedEntities } = useAdminViewContext();

  if (entityDiffList.length === 0) {
    return null;
  }

  console.log('entityDiffList', { entityDiffList, selectedEntities });

  return (
    <>
      <Typography variant="h2">
        Your requested changes ({entityDiffList.length})
      </Typography>
      {entityDiffList.map((entityDiff, idx) => (
        <Stack key={idx} component="section" sx={{ pt: '32px', gap: '8px' }}>
          <Stack direction="row">
            <Typography variant="h3">
              {entityDiff.oldEntity.label || entityDiff.oldEntity.title}
            </Typography>
            <ChangeListDetailsButton entity={entityDiff.oldEntity} />
          </Stack>
          <EditMultipleDiffTable entityDiff={entityDiff} />
        </Stack>
      ))}
    </>
  );
}
