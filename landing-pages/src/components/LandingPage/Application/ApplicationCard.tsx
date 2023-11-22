import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import LandingPageItemRenderer from '../LandingPageItemRenderer';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { arrangeItems } from 'helpers/landingPageHelpers';
import Skeleton from '@mui/material/Skeleton';
import LandingPageLink from '../LandingPageLink';

export type ApplicationCardProps = {
  cardTitle: string;
  items: LandingPageItemProps[];
};

export default function ApplicationCard({
  cardTitle,
  items,
}: ApplicationCardProps) {
  const { isError, isLoading, landingPageItems } = useLandingPageItems(items);
  const arrangedItems = arrangeItems(items, landingPageItems);

  return (
    <Card
      sx={{
        py: '34px',
        px: '37px',
        flex: 1,
        boxShadow: '0px 2px 4px 0px rgba(40, 51, 63, 0.24)',
      }}
    >
      <Typography
        sx={{
          color: '#004E6A',
          fontSize: '20px',
          lineHeight: '25px',
          fontWeight: 400,
        }}
      >
        {cardTitle}
      </Typography>
      <Box
        sx={{
          borderBottom: '1px solid #D1D9E2',
          my: '6px',
        }}
      />
      {arrangedItems.map((item) => (
        <LandingPageItemRenderer
          isError={isError}
          isLoading={isLoading}
          landingPageItems={landingPageItems}
          skeleton={<Skeleton />}
          item={
            <LandingPageLink landingPageItem={item} sx={{ fontSize: '14px', fontWeight: 600, lineHeight: '21px' }} />
          }
        />
      ))}
    </Card>
  );
}
