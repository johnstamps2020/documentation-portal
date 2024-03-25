import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useLayoutContext } from 'LayoutContext';
import { useSearchData } from 'hooks/useApi';
import { useLocaleParams } from 'hooks/useLocale';
import { useMobile } from 'hooks/useMobile';
import { useEffect, useState, forwardRef } from 'react';
import { useLocation } from 'react-router-dom';
import { searchTypeQueryParameterName } from 'vars';
import { Filters } from '../SearchDropdown/SearchHeaderLayoutContext';

type SearchBoxProps = {
  big?: boolean;
  searchFilters: Filters;
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

const SearchBox = forwardRef(
  ({ big = true, searchFilters }: SearchBoxProps, ref) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const { placeholder } = useLocaleParams();
    const { searchData } = useSearchData();
    const { isMobile } = useMobile();
    const { setTitle } = useLayoutContext();
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
          Object.keys(searchFilters).map((k: string) => (
            <InputBase
              id={k.toLowerCase()}
              key={k.toLowerCase()}
              type="hidden"
              name={k}
              value={searchFilters[k].join(',')}
            />
          ))}
        {query.get(searchTypeQueryParameterName) && (
          <InputBase
            id={searchTypeQueryParameterName}
            type="hidden"
            name={searchTypeQueryParameterName}
            value={query.get(searchTypeQueryParameterName)}
          />
        )}
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  }
);

export default SearchBox;
