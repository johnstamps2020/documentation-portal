import Typography from '@mui/material/Typography';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleDiffTable, { DiffTableRow } from './EditMultipleDiffTable';
import { getDisplayValue } from './editMultipleHelpers';

export default function EditMultipleChangeList() {
  const { changedEntities, changedFields } = useEditMultipleContext();

  console.log({ name: 'list', changedEntities });

  if (changedEntities.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="h2">
        Your requested changes ({changedEntities.length})
      </Typography>
      {changedEntities.map((entity, idx) => {
        if (!entity) {
          return null;
        }

        if (changedFields.length === 0) {
          return null;
        }

        const differences = changedFields
          .map((field) => {
            if (field.value !== entity[field.name]) {
              return field;
            }

            return null;
          })
          .filter(Boolean);

        if (differences.length === 0) {
          return null;
        }

        const rows: DiffTableRow[] = differences.map((field) => ({
          name: field!.name,
          oldValue: getDisplayValue(field!.type, entity[field!.name]),
          newValue: getDisplayValue(field!.type, field!.value),
        }));

        return (
          <section key={idx}>
            <Typography variant="h3">{entity?.label}</Typography>
            <EditMultipleDiffTable rows={rows} />
          </section>
        );
      })}
    </>
  );
}
