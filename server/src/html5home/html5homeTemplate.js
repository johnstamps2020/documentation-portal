import Home from './modules/Home.js';
import ReactDOM from 'react-dom';
import { createElement } from 'react';
import './html5home.css';

const domContainer = document.querySelector('#home_page_container');
ReactDOM.render(createElement(Home), domContainer);
