import Typography from '@mui/material/Typography';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleDiffTable from './EditMultipleDiffTable';

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
        <section key={idx}>
          <Typography variant="h3">{entityDiff.oldEntity.name}</Typography>
          <EditMultipleDiffTable entityDiff={entityDiff} />
        </section>
      ))}
    </>
  );
}
