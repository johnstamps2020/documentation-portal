import Home from './modules/Home.js';
import ReactDOM from 'react-dom';
import { createElement } from 'react';

const domContainer = document.querySelector('#home_page_container');
ReactDOM.render(createElement(Home), domContainer);
