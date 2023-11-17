import React from 'react';
import { createRoot } from 'react-dom/client';
import '../stylesheets/modules/searchBox.css';
import OfflineSearch from './components/Search/OfflineSearch';
import OnlineSearch from './components/Search/OnlineSearch';

export function addSearchBox(isOffline: boolean) {
  const searchContainer = document.getElementById('headerCenter');
  const root = createRoot(searchContainer!);

  if (isOffline) {
    root.render(<OfflineSearch />);
  } else {
    root.render(<OnlineSearch />);
  }
}
