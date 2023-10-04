import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

type EntityCardProps = {
  title: string;
  cardContents: JSX.Element;
  cardButtons: JSX.Element;
};

export default function EntityCard({
  title,
  cardContents,
  cardButtons,
}: EntityCardProps) {
  return (
    <Card
      sx={{
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Typography variant="h2">{title}</Typography>
        {cardContents}
      </CardContent>
      <CardActions>{cardButtons}</CardActions>
    </Card>
  );
}
