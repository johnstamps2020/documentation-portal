import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from '@tanstack/react-router';

type EntityLinkProps = {
  url: string;
  label: string;
};

export default function EntityLinkWithSlash({ url, label }: EntityLinkProps) {
  return (
    <Link
      to={`/${url}`}
      target="_blank"
      component={RouterLink}
      sx={{ textDecoration: 'underline' }}
    >
      <Typography variant="subtitle1" component="div">
        {label}
      </Typography>
    </Link>
  );
}
