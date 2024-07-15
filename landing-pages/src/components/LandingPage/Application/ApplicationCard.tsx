import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getListOfItemsToDisplayOnLandingPage } from 'helpers/landingPageHelpers';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import LandingPageLink from '../LandingPageLink';

export type ApplicationCardProps = {
  cardId: string;
  cardTitle: string;
  items: LandingPageItemProps[];
};

export default function ApplicationCard({
  cardId,
  cardTitle,
  items,
}: ApplicationCardProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const itemsToDisplay = getListOfItemsToDisplayOnLandingPage(
    items,
    allAvailableItems
  );

  return (
    <Card
      sx={{
        py: '34px',
        px: '37px',
        flex: 1,
        boxShadow: '0px 2px 4px 0px rgba(40, 51, 63, 0.24)',
      }}
      className="application-card"
      id={cardId}
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
      {itemsToDisplay.map((item, idx) => (
        <LandingPageLink
          landingPageItem={item}
          sx={{ fontSize: '14px', lineHeight: '150%', color: '00739D' }}
          key={idx}
        />
      ))}
    </Card>
  );
}
