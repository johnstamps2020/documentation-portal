import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router-dom';
import InternalTooltip from './InternalTooltip';

export default function LandingPageItem(item: {}) {
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    ></Stack>
  );
}
