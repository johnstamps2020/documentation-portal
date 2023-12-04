import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useAdminViewContext } from './AdminViewContext';

type EntityCardProps = {
  title: string;
  cardContents: JSX.Element;
  cardButtons: JSX.Element;
  cardWarning?: JSX.Element;
};

export default function EntityCard({
  title,
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
        {cardWarning}
        <Typography variant="h2">{title}</Typography>
        {cardContents}
      </CardContent>
      <CardActions>{cardButtons}</CardActions>
    </Card>
  );
}
