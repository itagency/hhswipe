import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker';

ReactDOM.render((
  <BrowserRouter basename="/helly-tinder/">
    <App />
  </BrowserRouter>
), document.getElementById('root'));
unregister();
