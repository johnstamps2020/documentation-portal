import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinkIcon from '@mui/icons-material/Link';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';

export type ExplorationItemProps = {
  title: string;
  description: string;
  link: string;
  subItems?: ExplorationItemProps[];
};

export default function ExplorationItem({
  title,
  description,
  link,
  subItems,
  handleSetItems,
}: ExplorationItemProps & {
  handleSetItems: (newItems: ExplorationItemProps[]) => void;
}) {
  function handleClick() {
    handleSetItems(subItems);
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <div>{description}</div>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          mt: 'auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          className={clsx('button button--secondary button--lg')}
          href={link}
          LinkComponent={Link}
          startIcon={<LinkIcon />}
        >
          View
        </Button>
        {subItems && (
          <Button
            className={clsx('button button--secondary button--lg')}
            onClick={handleClick}
            startIcon={<ArrowDownwardIcon />}
            variant="outlined"
          >
            Explore
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
