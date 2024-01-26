import { Translate } from '@doctools/components';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowLink from '@theme/ArrowLink';
import TagList from '@theme/TagList';
import React from 'react';

type ResourceProps = {
  label: string;
  href: string;
};

type HeroCenteredWithImageProps = {
  title: string;
  tags: string[];
  resources: ResourceProps[];
  imagePath: string;
  children: React.ReactNode;
  imageClassName?: string;
};

export default function HeroCenteredWithImage({
  title,
  tags,
  imagePath,
  resources,
  children,
  imageClassName,
}: HeroCenteredWithImageProps): JSX.Element {
  return (
    <Stack gap="24px" sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70%',
          background: '#EDF2F7',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={imagePath}
          alt=""
          className={['doNotZoom', imageClassName].join(' ')}
        />
      </Box>
      <Card
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          padding: '64px 80px',
          borderRadius: '8px',
          gap: '8px',
          mx: '1rem',
        }}
      >
        <Stack justifyContent="space-between">
          <Box>
            <Typography
              sx={{
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '125%',
              }}
              component="h1"
            >
              {title}
            </Typography>
            <Stack
              direction="row"
              sx={{
                gap: '8px',
              }}
            >
              <TagList tags={tags} />
            </Stack>
          </Box>
          <Stack gap="16px">
            <Typography
              component="div"
              sx={{
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: '125%',
              }}
            >
              <Translate id="heroCenteredWithImage.resources-heading">
                Resources
              </Translate>
            </Typography>
            <Stack gap="8px">
              {resources.map(({ label, href }) => (
                <ArrowLink href={href}>{label}</ArrowLink>
              ))}
            </Stack>
          </Stack>
        </Stack>
        <Box
          sx={{
            '& > *:last-child': {
              marginBottom: 0,
            },
          }}
        >
          {children}
        </Box>
      </Card>
    </Stack>
  );
}
