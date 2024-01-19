import Typography from '@mui/material/Typography';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleDiffTable from './EditMultipleDiffTable';
import Stack from '@mui/material/Stack';

export default function EditMultipleChangeList() {
  const { entityDiffList } = useEditMultipleContext();

  if (entityDiffList.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="h2">
        Your requested changes ({entityDiffList.length})
      </Typography>
      {entityDiffList.map((entityDiff, idx) => (
        <Stack key={idx} component="section" sx={{ pt: '32px', gap: '8px' }}>
          <Typography variant="h3">{entityDiff.oldEntity.label}</Typography>
          <EditMultipleDiffTable entityDiff={entityDiff} />
        </Stack>
      ))}
    </>
  );
}
