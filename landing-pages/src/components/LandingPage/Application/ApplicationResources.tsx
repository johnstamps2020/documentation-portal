import Box, { BoxProps } from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  getListOfItemsToDisplayOnLandingPage,
  LandingPageItemData,
} from 'helpers/landingPageHelpers';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import LandingPageLink from '../LandingPageLink';
import ApplicationDivider from './ApplicationDivider';
import { narrowWidth } from './ApplicationNarrowTwoColumnLayout';

function chunkArray(array: any[], chunkSize: number): any[] {
  var results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
}

export type ApplicationResourcesProps = {
  title: string;
  items: LandingPageItemProps[];
};

export default function ApplicationResources({
  title,
  items,
}: ApplicationResourcesProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  const narrowContainerProps: BoxProps['sx'] = {
    width: '100%',
    maxWidth: narrowWidth,
    mx: 'auto',
  };

  if (!allAvailableItems) {
    return null;
  }

  const itemsToDisplay = getListOfItemsToDisplayOnLandingPage(
    items,
    allAvailableItems
  );

  return (
    <Box
      sx={{
        backgroundColor: '#00739D',
        color: 'white',
        py: '30.64px',
        marginBottom: 0,
        px: '8px',
      }}
      className="application-resources"
    >
      <Box
        sx={{
          ...narrowContainerProps,
        }}
      >
        <Typography variant="h2" sx={{ fontSize: '24px' }}>
          {title}
        </Typography>
      </Box>
      <Container sx={{ py: '8px' }}>
        <ApplicationDivider color="white" />
      </Container>
      <Box
        sx={{
          ...narrowContainerProps,
          display: 'flex',
          gap: { xs: '8px', sm: '12px' },
        }}
      >
        {chunkArray(itemsToDisplay, 4).map(
          (chunk: LandingPageItemData[], idx) => (
            <Box
              sx={{ flex: { xs: 1, sm: '0 0 50%', md: '0 0 33%' } }}
              key={idx}
            >
              {chunk.map((item, idx) => (
                <LandingPageLink
                  landingPageItem={item}
                  sx={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: '21px',
                  }}
                  key={idx}
                />
              ))}
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}
