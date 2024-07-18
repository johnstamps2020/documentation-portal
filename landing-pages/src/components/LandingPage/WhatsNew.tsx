import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { LandingPageButton } from './LandingPageLink';

export type WhatsNewProps = {
  label: string;
  badge: string;
  item: LandingPageItemProps;
  content: string[];
};

export default function WhatsNew({
  label,
  badge,
  item,
  content,
}: WhatsNewProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems([item]);

  if (isError || !landingPageItems) {
    return null;
  }

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{ width: '300px', height: '600px' }}
      />
    );
  }

  return (
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
          What's new in {label}
        </Typography>
        <Typography
          variant="h3"
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 'normal',
          }}
        >
          {label} introduces the following key features and capabilities:
        </Typography>
        {content && (
          <ul
            style={{
              fontSize: '.875rem',
              marginLeft: '1rem',
              marginBlockStart: '1em',
              marginBlockEnd: '1em',
              marginInlineStart: '0px',
              marginInlineEnd: '0px',
              paddingInlineStart: '20px',
            }}
          >
            {content.map((feature) => {
              return (
                <li
                  style={{
                    marginBottom: '4.08px',
                    fontSize: '0.875rem',
                    lineHeight: 'normal',
                  }}
                  key={feature}
                >
                  {feature}
                </li>
              );
            })}
          </ul>
        )}
        {landingPageItems[0] && (
          <LandingPageButton
            variant="contained"
            sx={{
              width: '110px',
              margin: '10px auto 10px auto',
              padding: '4px',
            }}
            landingPageItem={landingPageItems[0]}
          />
        )}
      </Stack>
    </Paper>
  );
}
