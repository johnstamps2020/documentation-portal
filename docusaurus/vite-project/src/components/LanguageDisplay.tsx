import { useEffect, useState } from 'react';

export default function LanguageDisplay() {
  const lang =
    document.querySelector('html')?.getAttribute('lang') || 'unknown';

  return <div>Selected language: {lang}</div>;
}
