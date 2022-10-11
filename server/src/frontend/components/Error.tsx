import React from 'react';

type ErrorProps = {
  message: string;
};

export default function Error({ message }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: 'var(--body-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #f09897',
        borderRadius: '12px',
        margin: '3rem',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '2rem' }}>ERROR: {message}</div>
    </div>
  );
}
