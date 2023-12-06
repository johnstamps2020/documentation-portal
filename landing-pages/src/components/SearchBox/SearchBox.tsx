import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useLocaleParams } from 'hooks/useLocale';
import { useSearchData } from 'hooks/useApi';
import { useMobile } from 'hooks/useMobile';
import { useEffect, useState } from 'react';
import { useLayoutContext } from 'LayoutContext';

type SearchBoxProps = {
  big?: boolean;
};

const commonProps = {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '1px solid hsl(214, 22%, 58%)',
};

const bigSizeProps = {
  ...commonProps,
  height: '45px',
  width: '100%',
  maxWidth: '760px',
};

const regularSizeProps = {
  ...commonProps,
  height: '30px',
  width: '100%',
  maxWidth: '360px',
};

export default function SearchBox({ big = true }: SearchBoxProps) {
  const { placeholder } = useLocaleParams();
  const { searchData } = useSearchData();
  const { isMobile } = useMobile();
  const { setTitle, headerOptions } = useLayoutContext();
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  useEffect(() => {
    if (searchData) {
      setSearchPhrase(searchData.searchPhrase);

      if (searchData.searchPhrase) {
        setTitle(
          `${searchData.searchPhrase} | ${
            searchData.totalNumOfResults > 0
              ? `${searchData.totalNumOfResults} `
              : ``
          }search results`
        );
      }
    }
  }, [searchData, searchData?.searchPhrase, setTitle]);

  const showBigSearchBox = isMobile ? false : big;

  const searchFilters: { [key: string]: string[] } = {};
  if (big && searchData) {
    searchData.filters.forEach((f) => {
      const checkedValues = f.values.filter((v) => v.checked);

      if (checkedValues.length > 0) {
        searchFilters[f.name] = checkedValues
          .filter(Boolean)
          .map((v) => v.label);
      }
    });
  }

  if (!big && headerOptions.searchFilters) {
    Object.keys(headerOptions.searchFilters).forEach((k) => {
      searchFilters[k] = headerOptions.searchFilters![k];
    });
  }

  return (
    <Paper
      component="form"
      action="/search-results"
      elevation={0}
      sx={showBigSearchBox ? { ...bigSizeProps } : { ...regularSizeProps }}
    >
      <InputBase
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
        Object.keys(searchFilters).map((k: string) => (
          <InputBase
            id={k.toLowerCase()}
            key={k.toLowerCase()}
            type="hidden"
            name={k}
            value={searchFilters[k].join(',')}
          />
        ))}
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
