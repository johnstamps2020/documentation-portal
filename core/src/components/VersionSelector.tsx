import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';
import { VersionSelectorItem } from '../types/versionSelector';
import { SelectorInput } from './SelectorInput';

type VersionSelectorProps = {
  availableVersions: VersionSelectorItem[];
};

function getLabelFromVersionSelectorItem(item: VersionSelectorItem): string {
  if (item.releases?.length > 0) {
    return `${item.releases} (${item.versions})`;
  }

  return item.label;
}

function getTargetUrlNoSlash(targetUrl: string, currentUrl: string): string {
  const matchesRedirect = currentUrl
    .substring(targetUrl.length)
    .startsWith('/');

  if (matchesRedirect) {
    return targetUrl + currentUrl.substring(targetUrl.length);
  }
  return targetUrl;
}

export function VersionSelector({ availableVersions }: VersionSelectorProps) {
  const selectedVersion = availableVersions.find((v) => v.currentlySelected);

  async function handleChange(event: SelectChangeEvent) {
    const redirectTo = getTargetUrlNoSlash(
      event.target.value,
      window.location.pathname.substring(1)
    );
    window.location.assign(`/${redirectTo}`);
  }

  return (
    <FormControl
      variant="standard"
      sx={{
        display: 'flex',
        alignItems: 'left',
      }}
    >
      <Select
        labelId="version-selector-label"
        id="versionSelector"
        value={selectedVersion?.url || undefined}
        onChange={handleChange}
        input={<SelectorInput />}
      >
        {availableVersions.map((v, key) => (
          <MenuItem
            key={key}
            value={v.url}
            sx={{ fontSize: '0.875rem', p: '2px 13px' }}
          >
            {getLabelFromVersionSelectorItem(v)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
