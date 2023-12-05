import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useAdminViewContext } from './AdminViewContext';
import EntityCheckbox from './EntityCheckbox';
import { Entity } from './EntityListWithFilters';

type EntityCardProps = {
  title: string;
  entity: Entity;
  cardContents: JSX.Element;
  cardButtons: JSX.Element;
  cardWarning?: JSX.Element;
};

export default function EntityCard({
  title,
  entity,
  cardContents,
  cardButtons,
  cardWarning,
}: EntityCardProps) {
  const { listView } = useAdminViewContext();

  return (
    <Card
      sx={{
        padding: listView ? 0 : 1,
        display: 'flex',
        flexDirection: listView ? 'row' : 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: listView ? 'row' : 'column',
          justifyContent: 'space-between',
          height: '100%',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: listView ? 'row' : 'column',
            alignItems: listView ? 'center' : 'flex-start',
            gap: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {listView && <EntityCheckbox entity={entity} />}
            {cardWarning}
          </Box>
          <Typography variant="h2" sx={{ pb: 0 }}>
            {title}
          </Typography>
          {cardContents}
        </Box>
      </CardContent>
      <CardActions>{cardButtons}</CardActions>
    </Card>
  );
}
