import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import Skeleton from '@mui/material/Skeleton';
import { useState, useEffect } from 'react';

export type PageSelectorItem = {
  label: string;
  href: string;
  isDoc: boolean;
};

export type LandingPageSelectorProps = {
  label: string;
  selectedItemLabel: string;
  items: LandingPageItemProps[];
  labelColor: string;
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
    minWidth: '300px',
    textAlign: 'left',
    marginLeft: 0,
    marginRight: 'auto',
    width: '300px',
    backgroundColor: 'white',
    '&:focus': {
      borderRadius: 4,
      backgroundColor: 'white',
    },
  },
}));

export default function LandingPageSelector({
  items,
  label,
  selectedItemLabel,
  labelColor,
}: LandingPageSelectorProps) {
  const navigate = useNavigate();
  const { landingPageItems, isError, isLoading } = useLandingPageItems(items);
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

  if (isError || !landingPageItems) {
    return null;
  }

  if (isLoading) {
    return (
      <Skeleton variant="rectangular" sx={{ width: '300px', height: '55px' }} />
    );
  }

  const pageSelectorItems: PageSelectorItem[] = landingPageItems
    .map((item) => {
      const label = item.label || item.title || '';
      const itemHref = item.path || item.url || '';
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
        marginTop: '10px',
        alignItems: 'left',
        width: '300px',
      }}
    >
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
          width: '300px',
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
