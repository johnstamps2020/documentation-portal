import Box, { BoxProps } from '@mui/material/Box';
import { useAdminViewContext } from './AdminViewContext';

export default function AdminViewWrapper({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const { listView } = useAdminViewContext();

  const gridViewStyles: BoxProps['sx'] = {
    display: 'grid',
    gridTemplateColumns: {
      md: 'repeat(3, 1fr)',
      sm: 'repeat(2, 1fr)',
      xs: '1fr',
    },
    gap: 2,
    py: 6,
  };

  const listViewStyles: BoxProps['sx'] = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    py: 6,
  };

  return <Box sx={listView ? listViewStyles : gridViewStyles}>{children}</Box>;
}
