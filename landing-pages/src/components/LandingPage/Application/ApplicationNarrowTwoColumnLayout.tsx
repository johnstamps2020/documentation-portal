import Box from '@mui/material/Box';
import ApplicationDivider from './ApplicationDivider';
import Container from '@mui/material/Container';

export type ApplicationNarrowTwoColumnLayoutProps = {
  left: React.ReactNode | React.ReactNode[];
  right: React.ReactNode | React.ReactNode[];
  divider?: Boolean;
};

export const narrowWidth = '996px';

export default function ApplicationNarrowTwoColumnLayout({
  left,
  right,
  divider,
}: ApplicationNarrowTwoColumnLayoutProps) {
  return (
    <Container>
      <Box
        sx={{
          width: '100%',
          maxWidth: narrowWidth,
          mx: 'auto',
          my: '75px',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: '16px', sm: '16px', md: '32px' },
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: '100%',
          }}
        >
          {left}
        </Box>
        <Box
          sx={{
            flex: 1,
            height: '100%',
          }}
        >
          {right}
        </Box>
      </Box>
      {divider && <ApplicationDivider />}
    </Container>
  );
}
