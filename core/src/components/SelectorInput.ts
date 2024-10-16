import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const SelectorInput = styled(InputBase)(({ theme }) => ({
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
