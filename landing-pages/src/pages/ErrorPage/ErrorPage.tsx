import ServerMessagePage from 'pages/ServerMessagePage';
import Typography from '@mui/material/Typography';
import ErrorImage from './../../images/error-page.svg';
import { FallbackProps } from 'react-error-boundary';
import Box from '@mui/material/Box';

export default function ErrorPage({ error }: FallbackProps) {
  const informationToDisplay = (
    <>
      <Typography variant="h1" sx={{ color: 'black', textAlign: 'center' }}>
        Oops! Something went wrong
      </Typography>
      <Typography>
        We apologize for the inconvenience, but it seems that an unexpected
        error has occurred. Our team is already on the case, diligently working
        to fix the issue and get everything back on track. In the meantime,
        please try refreshing the page or come back a little later. We promise
        to have things up and running as soon as possible. 
      </Typography>
      <Box
        sx={{
          background: 'hsla(211, 22%, 20%, 0.04);',
          borderRadius: '6px',
          border: '1px solid gray',
          width: 'fit-content',
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
      informationToDisplay={informationToDisplay}
      backgroundImage={`url(${ErrorImage})`}
    />
  );
}
