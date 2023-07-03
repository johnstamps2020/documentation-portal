import React, { useEffect, useState } from 'react';
import styles from './importedRange.module.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type RangeSelectorProps = {
  options: string[];
  name: string;
  label: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
};

function RangeSelector({
  options,
  name,
  label,
  onChange,
  value,
}: RangeSelectorProps) {
  const labelId = `${name}-label`;

  function handleChange(event: SelectChangeEvent) {
    onChange(event.target.value);
  }

  return (
    <FormControl>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={name}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

type Item = {
  key: string;
  Contents: JSX.Element;
};

type ImportedRangeProps = {
  items: Item[];
  showLabels: boolean;
};

export default function ImportedRange({
  items,
  showLabels,
}: ImportedRangeProps) {
  const [from, setFrom] = useState(items[0].key);
  const [to, setTo] = useState(items[items.length - 1].key);
  const [selectedContent, setSelectedContent] = useState(items);

  function setRangeOfContent() {
    const newContent = [];
    let canAdd = false;

    for (const item of items) {
      if (item.key === from) {
        canAdd = true;
      }

      if (canAdd) {
        newContent.push(item);
      }

      if (item.key === to) {
        canAdd = false;
      }
    }

    setSelectedContent(newContent);
  }

  useEffect(
    function () {
      setRangeOfContent();
    },
    [from, to]
  );

  const options = items.map((o) => o.key);

  return (
    <>
      <div className={styles.selectors}>
        <RangeSelector
          options={options}
          name="selectFrom"
          label="from"
          onChange={setFrom}
          value={from}
        />
        <RangeSelector
          options={options}
          name="selectTo"
          label="to"
          onChange={setTo}
          value={to}
        />
      </div>
      {selectedContent &&
        selectedContent.map((item) => (
          <div key={item.key}>
            {showLabels && <div className={styles.title}>{item.key}</div>}
            <div key={item.key}>{item.Contents}</div>
          </div>
        ))}
    </>
  );
}
