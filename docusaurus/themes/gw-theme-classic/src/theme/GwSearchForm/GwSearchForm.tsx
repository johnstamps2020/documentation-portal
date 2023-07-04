import React, { useState, useEffect } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import HiddenSearchInputs from './HiddenSearchInputs';
import { translate } from '@theme/Translate';

function getSearchUrl() {
  if (window.location.hostname === 'localhost') {
    return 'https://docs.int.ccs.guidewire.net/search';
  }

  return `${window.location.protocol}//${window.location.hostname}/search`;
}

export default function GwSearchForm() {
  const isMobile = useIsMobile();
  const [searchUrl, setSearchUrl] = useState('');

  useEffect(function () {
    const url = getSearchUrl();
    setSearchUrl(url);
  }, []);

  return (
    <Paper component="form" action={searchUrl}>
      <TextField
        id="searchField"
        placeholder={translate({
          id: 'gwSearchForm.placeholder',
          message: 'Search',
          description: 'Text which appears in the search box, placeholder',
        })}
        type="search"
        variant="outlined"
        name="q"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton type="submit" size="small" title="search">
              <SearchIcon />
            </IconButton>
          ),
          sx: {
            height: '32px',
            width: isMobile ? '100%' : '360px',
          },
        }}
        sx={{
          backgroundColor: 'white',
          borderRadius: '4px',
        }}
      />
      <HiddenSearchInputs />
    </Paper>
  );
}
