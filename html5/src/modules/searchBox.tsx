import React from 'react';
import '../stylesheets/modules/searchBox.css';
import { render } from 'react-dom';
import OfflineSearch from './components/Search/OfflineSearch';
import OnlineSearch from './components/Search/OnlineSearch';

export function addSearchBox(isOffline: boolean) {
  const searchContainer = document.getElementById('headerCenter');

  if (isOffline) {
    render(<OfflineSearch />, searchContainer);
  } else {
    render(<OnlineSearch />, searchContainer);
  }
}
