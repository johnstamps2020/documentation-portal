import Stack from '@mui/material/Stack';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleBoolean from './EditMultipleFieldDefinitions/EditMultipleBoolean';
import EditMultipleText from './EditMultipleFieldDefinitions/EditMultipleText';

export default function EditMultipleFields() {
  const { editableFields } = useEditMultipleContext();

  return (
    <Stack sx={{ gap: '16px', pb: '64px' }}>
      {editableFields.map(({ name, type }, idx) => {
        if (type === 'string') {
          return <EditMultipleText key={idx} name={name} />;
        }

        if (type === 'boolean') {
          return <EditMultipleBoolean key={idx} name={name} />;
        }

        return (
          <div key={idx}>
            {name}: <code>{type}</code>
          </div>
        );
      })}
    </Stack>
  );
}
