import React, { useEffect, useState } from 'react';
import Card, { CardProps } from '@theme/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ShowMoreIcon from './arrow-down-circle.svg';
import { Box } from '@mui/material';
import TagList from '@theme/TagList';
import { translate } from '@theme/Translate';

type TagSelectButtonProps = {
  tag: string;
  active?: boolean;
  onClick: () => void;
};

function TagSelectButton({ tag, active, onClick }: TagSelectButtonProps) {
  return (
    <Button
      onClick={onClick}
      sx={{
        color: '#000',
        fontWeight: 400,
        backgroundColor: active ? 'white' : 'transparent',
        border: active ? '1px solid #D1D9E2' : '1px solid transparent',
      }}
    >
      {tag}
    </Button>
  );
}

type CardItem = CardProps & {
  tags: string[];
};

type CardListProps = {
  items: CardItem[];
};

const defaultLength = 6;

export default function CardList({ items }: CardListProps) {
  const [expanded, setExpanded] = useState(false);
  const [itemsToDisplay, setItemsToDisplay] = useState(items);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const uniqueTags = items
    .map(({ tags }) => tags)
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index);

  uniqueTags.sort((a, b) => (a > b ? 1 : -1));

  useEffect(() => {
    const filteredItems = selectedTag
      ? items.filter(({ tags }) => tags.includes(selectedTag))
      : items;

    filteredItems.sort((a, b) => (a.title > b.title ? 1 : -1));

    setItemsToDisplay(filteredItems);
  }, [selectedTag]);

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  return (
    <Stack
      sx={{
        gap: '32px',
      }}
    >
      <Stack
        direction="row"
        sx={{
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <TagSelectButton
          tag={translate({ id: 'cardList.all-items-button', message: 'All' })}
          onClick={() => setSelectedTag(null)}
          active={selectedTag === null}
        />
        {uniqueTags.map((tag, index) => (
          <TagSelectButton
            key={index}
            onClick={() => setSelectedTag(tag)}
            tag={tag}
            active={selectedTag === tag}
          />
        ))}
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: '40px',
        }}
      >
        {itemsToDisplay
          .slice(0, expanded ? undefined : defaultLength)
          .map(({ tags, cardStyles, imageWidth, ...cardProps }) => (
            <Box>
              <Card
                {...cardProps}
                cardStyles={{
                  minHeight: '442px',
                  height: '100%',
                  ...cardStyles,
                }}
                imageWidth={imageWidth || 305}
              >
                <Stack
                  direction="row"
                  sx={{
                    gap: '4px',
                  }}
                >
                  <TagList tags={tags} />
                </Stack>
              </Card>
            </Box>
          ))}
      </Box>
      {itemsToDisplay.length > defaultLength ? (
        <Button
          endIcon={
            <ShowMoreIcon
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.6s ease',
              }}
            />
          }
          onClick={toggleExpanded}
        >
          {expanded ? `Show less` : `Show more`}
        </Button>
      ) : (
        <div></div>
      )}
    </Stack>
  );
}
