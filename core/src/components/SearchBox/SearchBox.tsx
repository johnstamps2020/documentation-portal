import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import React, { forwardRef, useEffect, useState } from 'react';

type SearchBoxProps = {
  big?: boolean;
  searchFilters: { [key: string]: string[] };
  placeholder: string;
  isMobile: boolean;
} & InputBaseProps;

const commonProps = {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid hsl(214, 22%, 58%)',
};

const bigSizeProps = {
  ...commonProps,
  height: '45px',
  width: '100%',
  maxWidth: '760px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const regularSizeProps = {
  ...commonProps,
  height: '30px',
  width: '100%',
  maxWidth: '360px',
  marginLeft: '0',
};

export const SearchBox = forwardRef(
  (
    { big = true, searchFilters, placeholder, isMobile }: SearchBoxProps,
    ref
  ) => {
    const query = new URLSearchParams(window.location.search);
    const [searchPhrase, setSearchPhrase] = useState<string>(
      query.get('q') || ''
    );

    const showBigSearchBox = isMobile ? false : big;

    return (
      <Paper
        component="form"
        action="/search-results"
        elevation={0}
        sx={showBigSearchBox ? { ...bigSizeProps } : { ...regularSizeProps }}
      >
        <InputBase
          inputRef={ref}
          sx={{
            ml: 1,
            flex: 1,
            '& .MuiInputBase-input': {
              padding: 0,
            },
            '& input:-webkit-autofill': {
              backgroundColor: '#fff!important' as any,
              WebkitBoxShadow: '0 0 0 30px white inset !important' as any,
              fontFamily: 'Source Sans Pro,Helvetica,Arial,sans-serif',
            },
          }}
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          inputProps={{ 'aria-label': placeholder }}
          name="q"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        {searchFilters &&
          Object.keys(searchFilters).map((k: string) => {
            if (searchFilters[k].length === 0) {
              return null;
            }
            return (
              <InputBase
                id={k.toLowerCase()}
                key={k.toLowerCase()}
                type="hidden"
                name={k}
                value={searchFilters[k].join(',')}
              />
            );
          })}
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  }
);
