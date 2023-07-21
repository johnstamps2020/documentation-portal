import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { mainHeight } from 'components/Layout/Layout';
import Container from '@mui/material/Container';

type TemplatePageProps = {
  informationToDisplay: JSX.Element | JSX.Element[];
  backgroundImage?: string;
};

export default function TemplatePage({
  informationToDisplay,
  backgroundImage,
}: TemplatePageProps) {
  return (
    <Grid
      container
      sx={{
        minHeight: mainHeight,
        background: 'linear-gradient(135deg, white, lightblue)',
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          background: 'white',
          border: '1px solid gray',
          width: { xs: '100%', sm: '100%', md: '950px', lg: '1024px' },
          height: 'fit-content',
          boxShadow: '10px 5px 12px rgba(0, 0, 0, 0.3)',
          margin: 'auto',
          padding: { xs: '1.5rem', sm: '4rem 3rem' },
        }}
      >
        <Stack spacing={4} sx={{ alignItems: 'center' }}>
          {backgroundImage && (
            <Container
              sx={{
                backgroundImage: `${backgroundImage}`,
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                height: { xs: '150px', sm: '250px', md: '350px' },
                textAlign: 'center',
              }}
            />
          )}
          {informationToDisplay}
        </Stack>
      </Box>
    </Grid>
  );
}
