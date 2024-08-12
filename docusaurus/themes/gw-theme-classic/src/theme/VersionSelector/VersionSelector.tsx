import React from 'react';
import { useDocContext } from '@theme/DocContext';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { VersionSelectorProps } from '@theme/VersionSelector';

function arrayMoveToTop(arr: VersionSelectorProps[], phrase: string) {
  const fromIndex = arr.findIndex((v) => v.label.includes(phrase));
  if (fromIndex !== -1) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(0, 0, element);
  }
}

function sortVersions(a: VersionSelectorProps, b: VersionSelectorProps) {
  if (a.versions && b.versions) {
    return a.versions[0].localeCompare(b.versions[0], undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
}

function getLabelFromVersionObject(
  versionObject: VersionSelectorProps
): string {
  if (versionObject.releases?.length > 0) {
    return `${versionObject.releases} (${versionObject.versions})`;
  }

  return versionObject.label;
}

function VersionSelector() {
  const docContext = useDocContext();
  const availableVersions = docContext.availableVersions;

  if (
    !availableVersions ||
    !availableVersions.length ||
    availableVersions.length === 0
  ) {
    return null;
  }

  function handleChange(event: SelectChangeEvent) {
    const url =
      window.location.hostname === 'localhost'
        ? `https://docs.staging.ccs.guidewire.net`
        : `https://${window.location.hostname}`;
    const targetUrl = `${url}/${event.target.value}`;
    window.location.href = targetUrl;
  }

  availableVersions.sort(sortVersions).reverse();
  arrayMoveToTop(availableVersions, 'next');

  const selectedVersion = availableVersions.find((v) => v.currentlySelected);

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          paleBackground: {
            main: 'white',
          },
          darkBlue: { main: 'darkblue' },
          mode: 'dark',
        },
      })}
    >
      <FormControl size="small">
        <InputLabel id="version-selector-label">versions</InputLabel>
        <Select
          labelId="version-selector-label"
          id="version-selector"
          value={selectedVersion.url}
          label="versions"
          onChange={handleChange}
          sx={{ height: '32px' }}
        >
          {availableVersions.map((v, key) => (
            <MenuItem key={key} value={v.url}>
              {getLabelFromVersionObject(v)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  );
}

export default VersionSelector;
