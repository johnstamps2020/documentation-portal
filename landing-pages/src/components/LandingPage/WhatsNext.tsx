import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from './LandingPageItemsContext';
import { LandingPageButton } from './LandingPageLink';
import { findMatchingPageItemData } from 'helpers/landingPageHelpers';

export type WhatsNextProps = {
  label: string;
  badge?: string;
  item: LandingPageItemProps;
};

export default function WhatsNext({ label, badge, item }: WhatsNextProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const matchingItem = findMatchingPageItemData(allAvailableItems, item);

  return (
    <>
      {matchingItem && (
        <Paper
          sx={{
            width: '300px',
            padding: '24px',
            gap: '8px',
          }}
        >
          <Stack>
            {badge && (
              <img
                src={badge}
                alt="Release logo"
                aria-label="Release logo"
                style={{
                  width: '160px',
                  height: '160px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: '1.5rem',
                }}
              ></img>
            )}
            <Typography
              variant="h2"
              style={{
                margin: '0 auto 0.25rem auto',
                fontSize: '1.25rem',
                fontWeight: 600,
                paddingBottom: '0.5rem',
                lineHeight: 'normal',
              }}
            >
              What's coming in {label}
            </Typography>
            {matchingItem && (
              <LandingPageButton
                variant="contained"
                sx={{
                  width: '110px',
                  margin: '10px auto 10px auto',
                  padding: '4px',
                }}
                landingPageItem={{
                  ...matchingItem,
                  label: item.label,
                }}
              />
            )}
          </Stack>
        </Paper>
      )}
    </>
  );
}
