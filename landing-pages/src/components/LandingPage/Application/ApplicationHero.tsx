import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { heroImageSource } from './heroImage';

export default function ApplicationHero() {
  return (
    <Box
      sx={{
        pt: '26px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '12px',
          backgroundColor: 'primary.main',
          zIndex: -1,
        }}
      />
      <Container>
        <Grid
          container
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Grid sx={{ maxWidth: '466px' }}>
            <Stack gap={3}>
              <Typography variant="h1" sx={{ lineHeight: 1.4, fontSize: 30 }}>
                Guidewire InsuranceSuite PolicyCenter
              </Typography>
              <Box sx={{ pb: '60px' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 14,
                    px: 3.5,
                    py: 0.5,
                    ':hover': {
                      color: 'white',
                    },
                  }}
                >
                  Release notes
                </Button>
              </Box>
            </Stack>
          </Grid>
          <Grid alignSelf="flex-end">
            <img src={heroImageSource} alt="" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
