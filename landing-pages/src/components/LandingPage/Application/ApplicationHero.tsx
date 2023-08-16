import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ReactComponent as HeroImage } from './application-hero-image.svg';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';

export default function ApplicationHero() {
  const { setTitle } = useLayoutContext();

  const title = 'Guidewire InsuranceSuite PolicyCenter';

  useEffect(() => {
    setTitle(title);
  }, [setTitle]);

  return (
    <Box
      sx={{
        pt: '26px',
        position: 'relative',
        minHeight: 220,
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Container>
        <Grid container justifyContent="space-between">
          <Grid sx={{ maxWidth: '466px' }}>
            <Stack
              gap={3}
              justifyContent="space-between"
              height="100%"
              sx={{ pb: '8px' }}
            >
              <Typography variant="h1" sx={{ lineHeight: 1.4, fontSize: 30 }}>
                {title}
              </Typography>
              <Box>
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
            <HeroImage height={170} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
