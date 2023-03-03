import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useLandingPageItems } from '../../hooks/useLandingPageItems';
import { LandingPageItemProps } from '../../pages/LandingPage/LandingPage';

type PageSelectorItem = {
  label: string;
  href: string;
};

export type LandingPageSelectorProps = {
  label: string;
  selectedItemLabel: string;
  items: LandingPageItemProps[];
  labelColor: string;
};

function sortPageSelectorItems(unsortedPageSelectorItems: PageSelectorItem[]) {
  const isSemVerLabel = unsortedPageSelectorItems.some(
    i => i.label.search(/^([0-9]+\.[0-9]+\.[0-9]+)$/g) === 0
  );
  return isSemVerLabel
    ? unsortedPageSelectorItems
        .sort(function(a, b) {
          const labelA = a.label
            .split('.')
            .map(n => +n + 100000)
            .join('.');
          const labelB = b.label
            .split('.')
            .map(n => +n + 100000)
            .join('.');
          return labelA > labelB ? 1 : -1;
        })
        .reverse()
    : unsortedPageSelectorItems
        .sort((a, b) => (a.label > b.label ? 1 : -1))
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
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
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
  if (isError || isLoading || !landingPageItems) {
    return null;
  }
  const pageSelectorItems = landingPageItems
    .map(item => {
      const label = item.title || item.label || '';
      const href = `/${item.path}` || item.url || '';

      return {
        label,
        href,
      };
    })
    .filter(item => item.label != '' && item.href != '');
  const sortedPageSelectorItems = sortPageSelectorItems(pageSelectorItems);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedItem = pageSelectorItems.find(
      i => i.label === event.target.value
    );

    if (!selectedItem) {
      return null;
    }

    if (selectedItem.href.startsWith('http')) {
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
        sx={{ color: labelColor, fontSize: 20, fontWeight: 400 }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="page-selector-label"
        id="page-selector"
        value={items.length > 0 ? selectedItemLabel : ''}
        onChange={handleChange}
        input={<PageSelectorInput />}
        renderValue={value => {
          return value;
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
        {sortedPageSelectorItems.map(item => (
          <MenuItem
            disabled={item.label === selectedItemLabel}
            value={item.label}
            key={item.label}
            sx={{ fontSize: '0.875rem' }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
