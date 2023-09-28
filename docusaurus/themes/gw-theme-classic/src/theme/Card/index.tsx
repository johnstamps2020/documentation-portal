import React from 'react';
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@docusaurus/Link';
import ArrowForwardIcon from './arrow-forward.svg';

export type CardProps = {
  title: string;
  children?: React.ReactNode;
  imagePath?: string;
  imageWidth?: number;
  cardStyles?: MuiCardProps['sx'];
  imageClassName?: string;
  actionLink?: {
    label: string;
    href: string;
  };
};

export default function Card({
  children,
  title,
  cardStyles,
  imageWidth,
  imagePath,
  imageClassName,
  actionLink,
}: CardProps): JSX.Element {
  return (
    <MuiCard
      sx={{
        boxShadow: 'none',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        flex: '1 0 0',
        ...cardStyles,
      }}
    >
      {imagePath && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flex: '1 0 0',
            alignSelf: 'stretch',
            background: '#F7F7F7',
          }}
        >
          <Link href={actionLink?.href}>
            <img
              src={imagePath}
              alt={title}
              width={imageWidth}
              className={['doNotZoom', imageClassName].join(' ').trim()}
            />
          </Link>
        </Box>
      )}
      <Stack
        sx={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          padding: '0 8px',
          gap: '8px',
          background: 'white',
        }}
      >
        <Typography
          component="div"
          sx={{
            fontFamily: 'Avenir, Helvetica, sans-serif',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '21px',
          }}
        >
          {title}
        </Typography>
        <Box>{children}</Box>
      </Stack>
      {actionLink && (
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignSelf: 'stretch',
            px: '8px',
          }}
        >
          <Link
            href={actionLink.href}
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                color: '#28333F',
                fontWeight: 400,
                lineHeight: '21px',
              }}
            >
              {actionLink.label}
            </Typography>
            <ArrowForwardIcon />
          </Link>
        </CardActions>
      )}
    </MuiCard>
  );
}
