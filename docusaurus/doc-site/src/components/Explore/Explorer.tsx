import React, { useEffect, useState } from 'react';
import ExplorationItem, { ExplorationItemProps } from './ExplorationItem';
import { explorationContent } from './items';
import Grid from '@mui/material/Unstable_Grid2';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@mui/material/Button';

export default function Explorer() {
  const [items, setItems] =
    useState<ExplorationItemProps[]>(explorationContent);
  const [parentItems, setParentItems] = useState<ExplorationItemProps[][]>([]);

  function handleSetItems(newItems: ExplorationItemProps[]) {
    setParentItems((existingParentItems) => [...existingParentItems, items]);
    setItems(newItems);
  }

  function handleBack() {
    setItems(parentItems[parentItems.length - 1]);
    setParentItems((existingParentItems) => existingParentItems.slice(0, -1));
  }

  return (
    <Grid container spacing={2} paddingTop={3} paddingBottom={3}>
      {parentItems.length > 0 && (
        <Grid
          xs={12}
          sm={3}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Button
            startIcon={<KeyboardBackspaceIcon />}
            onClick={handleBack}
            variant="contained"
          >
            Back
          </Button>
        </Grid>
      )}
      {items.map((item) => (
        <Grid key={item.title} xs={12} sm={3}>
          <ExplorationItem {...item} handleSetItems={handleSetItems} />
        </Grid>
      ))}
    </Grid>
  );
}
