import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ApplicationDivider from './ApplicationDivider';
import ApplicationCard, { ApplicationCardProps } from './ApplicationCard';

export type ApplicationCardSectionProps = { items: ApplicationCardProps[] };

export default function ApplicationCardSection({
  items,
}: ApplicationCardSectionProps) {
  return (
    <Container id="cards">
      <Box
        sx={{
          display: 'flex',
          my: { xs: '40px', sm: '40px', md: '75px' },
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          gap: { xs: '8px', sm: '16px', md: '47px' },
        }}
      >
        {items.map((item, idx) => (
          <ApplicationCard {...item} key={idx} />
        ))}
      </Box>
      <ApplicationDivider />
    </Container>
  );
}
