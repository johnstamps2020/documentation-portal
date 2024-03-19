import React, { useEffect, useState } from 'react';
import './OverlayLoader.css';

export default function OverlayLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.fonts.load('12px Source Sans Pro').then(() => setMounted(true));
  }, []);

  if (mounted) {
    return null;
  }

  return <div className="guidewire-overlay-loader" />;
}
