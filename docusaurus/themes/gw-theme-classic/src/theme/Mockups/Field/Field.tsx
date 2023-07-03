import React from 'react';
import styles from './Field.module.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export enum FieldType {
  dropdown,
  text,
}

type FieldProps = {
  label: string;
  value: string;
  type: FieldType;
};

export function Field({ label, value, type }: FieldProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{label}</div>
      <div className={styles.field}>
        <span>{value}</span>
        {type === FieldType.dropdown && (
          <KeyboardArrowDownIcon className={styles.rightSideIcon} />
        )}
      </div>
    </div>
  );
}
