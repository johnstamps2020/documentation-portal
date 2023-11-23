import Box, { BoxProps } from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { arrangeItems } from 'helpers/landingPageHelpers';
import {
    LandingPageItemData,
    useLandingPageItems,
} from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import LandingPageItemRenderer from '../LandingPageItemRenderer';
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
  const { isError, isLoading, landingPageItems } = useLandingPageItems(items);
  const arrangedItems = arrangeItems(items, landingPageItems);

  const narrowContainerProps: BoxProps['sx'] = {
    width: '100%',
    maxWidth: narrowWidth,
    mx: 'auto',
  };

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
        {chunkArray(arrangedItems, 4).map(
          (chunk: LandingPageItemData[], idx) => (
            <Box sx={{ flex: { xs: 1, sm: '0 0 50%', md: '0 0 33%' } }}>
              {chunk.map((item, idx) => (
                <LandingPageItemRenderer
                  key={idx}
                  isError={isError}
                  isLoading={isLoading}
                  landingPageItems={landingPageItems}
                  skeleton={<Skeleton sx={{ height: '14px', width: '60ch' }} />}
                  item={
                    <LandingPageLink
                      landingPageItem={item}
                      sx={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: '21px',
                      }}
                      showExternalIcon={item?.url?.startsWith('http')}
                    />
                  }
                />
              ))}
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}
