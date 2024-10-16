// Paweł was here
import { PageItemsResponse } from '@doctools/server';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
import { findMatchingPageItemData } from 'helpers/landingPageHelpers';
import { useEffect, useState } from 'react';
import { useLandingPageItemsContext } from './LandingPageItemsContext';
import { SelectorInput } from '@doctools/core';

export type PageSelectorItem = {
  label: string;
  href: string;
  isDoc: boolean;
};

export type LandingPageSelectorInContextProps = {
  label?: string;
  selectedItemLabel: string;
  items: LandingPageItemProps[];
  labelColor?: string;
  predefinedAvailableItems?: PageItemsResponse;
  sx?: SelectProps['sx'];
};

export function sortPageSelectorItems(
  unsortedPageSelectorItems: PageSelectorItem[]
) {
  const copyOfItems = [...unsortedPageSelectorItems];

  return copyOfItems
    .sort(function (a, b) {
      return a.label.localeCompare(b.label, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    })
    .reverse();
}

function LandingPageSelectorPredefined({
  items,
  predefinedAvailableItems,
  label,
  selectedItemLabel,
  labelColor,
  sx,
}: LandingPageSelectorInContextProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      setIsOpen(false);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  if (!predefinedAvailableItems) {
    return null;
  }

  const allowedItems = items.reduce((acc: LandingPageItemProps[], item) => {
    const foundItem = findMatchingPageItemData(predefinedAvailableItems, item);
    if (foundItem !== undefined) {
      if (foundItem.url) {
        acc.push({ ...item, url: foundItem.url });
      } else {
        acc.push(item);
      }
    }
    return acc;
  }, []);

  const pageSelectorItems: PageSelectorItem[] = allowedItems
    .map((item) => {
      const label = item.label || '';
      const itemHref = item.pagePath || item.url || '';
      const href = itemHref !== '' ? `/${itemHref}` : itemHref;
      const isDoc = item.docId ? true : false;
      return {
        label,
        href,
        isDoc,
      };
    })
    .filter((item) => item.label !== '' && item.href !== '');
  const sortedPageSelectorItems = sortPageSelectorItems(pageSelectorItems);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedItem = pageSelectorItems.find(
      (i) => i.label === event.target.value
    );

    if (!selectedItem) {
      return null;
    }

    return (window.location.href = selectedItem.href);
  };

  return (
    <FormControl
      variant="standard"
      sx={{
        display: 'flex',
        alignItems: 'left',
      }}
    >
      {label && (
        <InputLabel
          id="page-selector-label"
          sx={{
            color: labelColor,
            fontSize: 20,
            fontWeight: 400,
            '&.Mui-focused': {
              color: labelColor,
            },
          }}
        >
          {label}
        </InputLabel>
      )}
      <Select
        labelId="page-selector-label"
        id="page-selector"
        open={isOpen}
        onOpen={() => {
          setIsOpen(true);
        }}
        onClose={() => {
          setIsOpen(false);
        }}
        value={items.length > 0 ? selectedItemLabel : ''}
        onChange={handleChange}
        input={<SelectorInput />}
        renderValue={(value) => {
          return value;
        }}
        MenuProps={{
          style: {
            maxHeight: 400,
          },
          disableScrollLock: true,
        }}
        sx={{
          textAlign: 'left',
          marginLeft: 0,
          marginRight: 'auto',
          backgroundColor: 'white',
          borderRadius: 4,
          ...sx,
        }}
      >
        {sortedPageSelectorItems.map((item) => (
          <MenuItem
            value={item.label}
            key={item.label}
            sx={{ fontSize: '0.875rem', p: '2px 13px' }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function LandingPageSelectorInContextWrapper(
  props: LandingPageSelectorInContextProps
) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  return (
    <LandingPageSelectorPredefined
      {...props}
      predefinedAvailableItems={allAvailableItems}
    />
  );
}

export default function LandingPageSelectorInContext(
  props: LandingPageSelectorInContextProps
) {
  if (props.predefinedAvailableItems) {
    return <LandingPageSelectorPredefined {...props} />;
  }

  return <LandingPageSelectorInContextWrapper {...props} />;
}
