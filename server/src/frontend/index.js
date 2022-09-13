const { default: LandingPage } = require('./components/LandingPage');
import { render } from 'react-dom';
import React from 'react';

const container = document.querySelector('#dynamic-content');

if (container) {
  render(<LandingPage />, container);
}
