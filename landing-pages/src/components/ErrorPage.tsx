import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FallbackProps } from 'react-error-boundary';
import ErrorImage from '../images/error-page.svg';
import ServerMessagePage from './ServerMessagePage';

export default function ErrorPage({ error }: FallbackProps) {
  const informationToDisplay = (
    <>
      <Typography variant="h1" sx={{ color: 'black', textAlign: 'center' }}>
        Unable to load page
      </Typography>
      <Typography>
        A technical issue has occurred on our end. We are sorry for the
        inconvenience. Our team is working to fix the issue. In the meantime,
        please try refreshing the page or come back a little later.
      </Typography>
      <Box
        sx={{
          background: 'hsla(211, 22%, 20%, 0.04);',
          borderRadius: '6px',
          border: '1px solid gray',
          width: '100%',
          maxWidth: { xs: '100%', sm: '100%', md: '950px', lg: '1024px' },
          height: 'fit-content',
          maxHeight: '200px',
          margin: 'auto',
          padding: { xs: '1.5rem', sm: '1rem 1rem' },
        }}
      >
        <Typography>{error.message}.</Typography>
      </Box>
    </>
  );

  return (
    <ServerMessagePage
      title="Error"
      informationToDisplay={informationToDisplay}
      backgroundImage={`url(${ErrorImage})`}
    />
  );
}
