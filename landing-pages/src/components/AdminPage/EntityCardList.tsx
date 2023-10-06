import Box from '@mui/material/Box';
import EntityCard from './EntityCard';
import { Entity } from './EntityListWithFilters';
import EntityLink from './EntityLink';
import EditButton from './EditButton';

type EntityCardListProps = {
  entities: Entity[];
  entityName: string;
  formComponent: JSX.Element;
  duplicateButton: JSX.Element;
  deleteButton: JSX.Element;
};

export default function EntityCardList({
  entities,
  entityName,
  formComponent,
  duplicateButton,
  deleteButton,
}: EntityCardListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          md: 'repeat(3, 1fr)',
          sm: 'repeat(2, 1fr)',
          xs: '1fr',
        },
        gap: 2,
        py: 6,
      }}
    >
      {entities.map(({ label, url }) => (
        <EntityCard
          title={label}
          cardContents={<EntityLink url={url} label={url} />}
          cardButtons={
            <>
              <EditButton
                buttonLabel={`Open ${entityName} editor`}
                dialogTitle={`Update ${entityName} settings`}
                formComponent={formComponent}
              />
              {duplicateButton}
              {deleteButton}
            </>
          }
        />
      ))}
    </Box>
  );
}
