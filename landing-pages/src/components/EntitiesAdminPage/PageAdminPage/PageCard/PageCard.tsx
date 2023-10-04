import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import EditButton from './Buttons/EditButton';
import DeleteButton from './Buttons/DeleteButton';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import DuplicateButton from './Buttons/DuplicateButton';

type PageCardProps = {
  title: string;
  path: string;
};

export default function PageCard({ title, path }: PageCardProps) {
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
        <Link
          to={`/${path}`}
          target="_blank"
          component={RouterLink}
          sx={{ textDecoration: 'underline' }}
        >
          <Typography variant="subtitle1" component="div">
            {path}
          </Typography>
        </Link>
      </CardContent>
      <CardActions>
        <EditButton pagePath={path} />
        <DuplicateButton pagePath={path} />
        <DeleteButton pagePath={path} />
      </CardActions>
    </Card>
  );
}
