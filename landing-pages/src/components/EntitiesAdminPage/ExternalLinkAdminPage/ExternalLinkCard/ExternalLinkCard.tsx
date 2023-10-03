import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import EditButton from './Buttons/EditButton';
import DeleteButton from './Buttons/DeleteButton';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import DuplicateButton from './Buttons/DuplicateButton';

type ExternalLinkCardProps = {
  label: string;
  url: string;
};

export default function ExternalLinkCard({
  label,
  url,
}: ExternalLinkCardProps) {
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
        <Typography variant="h2">{label}</Typography>
        <Link
          to={`${url}`}
          target="_blank"
          component={RouterLink}
          sx={{ textDecoration: 'underline' }}
        >
          <Typography variant="subtitle1" component="div">
            {url}
          </Typography>
        </Link>
      </CardContent>
      <CardActions>
        <EditButton externalLinkUrl={url} />
        <DuplicateButton externalLinkUrl={url} />
        <DeleteButton externalLinkUrl={url} />
      </CardActions>
    </Card>
  );
}
