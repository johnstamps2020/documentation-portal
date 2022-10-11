import React from 'react';

export default function Loader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', fontWeight: 600 }}>Loading...</div>
    </div>
  );
}
