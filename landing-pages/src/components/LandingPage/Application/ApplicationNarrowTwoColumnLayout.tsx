import Box from '@mui/material/Box';

export type ApplicationNarrowTwoColumnLayoutProps = {
  left: React.ReactNode | React.ReactNode[];
  right: React.ReactNode | React.ReactNode[];
};

export default function ApplicationNarrowTwoColumnLayout({
  left,
  right,
}: ApplicationNarrowTwoColumnLayoutProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1096px',
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
  );
}
