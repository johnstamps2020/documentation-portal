import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { findMatchingPageItemData } from 'helpers/landingPageHelpers';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandingPageItemsContext } from './LandingPageItemsContext';

export type PageSelectorItem = {
  label: string;
  href: string;
  isDoc: boolean;
};

export type LandingPageSelectorProps = {
  label?: string;
  selectedItemLabel: string;
  items: LandingPageItemProps[];
  labelColor?: string;
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

const PageSelectorInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    border: '1px solid #ced4da',
    fontSize: '0.875rem',
    padding: '4px 12px',
    textAlign: 'left',
    marginLeft: 0,
    marginRight: 'auto',
    backgroundColor: 'white',
    '&:focus': {
      borderRadius: 4,
      backgroundColor: 'white',
    },
  },
}));

export default function LandingPageSelectorInContext({
  items,
  label,
  selectedItemLabel,
  labelColor,
  sx,
}: LandingPageSelectorProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { allAvailableItems } = useLandingPageItemsContext();

  useEffect(() => {
    const scrollHandler = () => {
      setIsOpen(false);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  if (!allAvailableItems) {
    return null;
  }

  const allowedItems = items.filter(
    (item) => findMatchingPageItemData(allAvailableItems, item) !== undefined
  );

  const pageSelectorItems: PageSelectorItem[] = allowedItems
    .map((item) => {
      const label = item.label || '';
      const itemHref = item.pagePath || item.url || '';
      const href = itemHref !== '' ? `/${itemHref}` : itemHref;
      const isDoc = item.url ? true : false;
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

    if (selectedItem.href.startsWith('http') || selectedItem.isDoc) {
      return (window.location.href = selectedItem.href);
    }

    return navigate(selectedItem.href);
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
        input={<PageSelectorInput />}
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
