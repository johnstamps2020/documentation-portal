import Box from '@mui/material/Box';
import { replaceAmpersandInUrl } from 'hooks/useExternalLinkData';
import { ExternalLink } from 'server/dist/model/entity/ExternalLink';
import ExternalLinkCard from './ExternalLinkCard/ExternalLinkCard';

type ExternalLinkListProps = {
  externalLinks: ExternalLink[];
};

export default function ExternalLinkList({
  externalLinks,
}: ExternalLinkListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          md: 'repeat(3, 1fr)',
          sm: 'repeat(2, 1fr)',
          xs: '1fr',
        },
        gap: 2,
        py: 6,
      }}
    >
      {externalLinks.map(({ url, label }) => (
        <ExternalLinkCard
          url={replaceAmpersandInUrl(url)}
          label={label}
          key={url}
        />
      ))}
    </Box>
  );
}
