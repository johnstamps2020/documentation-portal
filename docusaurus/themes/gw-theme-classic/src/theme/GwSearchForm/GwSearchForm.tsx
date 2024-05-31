import { translate } from '@doctools/components';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import HiddenSearchInputs from './HiddenSearchInputs';
import { useDocContext } from '@theme/DocContext';
import { Filters } from '@doctools/components';

function getSearchUrl() {
  if (window.location.hostname === 'localhost') {
    return 'https://docs.staging.ccs.guidewire.net/search';
  }

  return `${window.location.protocol}//${window.location.hostname}/search`;
}

export default function GwSearchForm() {
  const isMobile = useIsMobile();
  const [searchUrl, setSearchUrl] = useState('');
  const { searchMeta } = useDocContext();

  if (!searchMeta) {
    return null;
  }

  const { docTitle, platform, product, version, release } = searchMeta;
  const isCloudDoc = platform.includes('Cloud');
  const isSelfManagedDoc = platform.includes('Self-managed');
  const releaseExists = release.length > 0;
  const versionExists = version.length > 0;
  console.log(release);

  const defaultFilters = useMemo(() => {
    const df: Filters = {};
    // TODO: see if there is sessionStorage of latestLandingPageReleases and use that
    // if (window.docPlatform) {
    //   df.platform = [window.docPlatform];
    // }
    if (isCloudDoc && releaseExists) {
      df.release = release;
    }
    if (isSelfManagedDoc && versionExists) {
      df.version = version;
    }
    if (isSelfManagedDoc && !isCloudDoc) {
      df.platform = platform;
    }
    if (product) {
      df.product = product;
    }
    // TODO: add language?
    return df;
  }, [platform, product, version, release]);

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
        autoComplete="off"
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
