import React from 'react';
import ReactDOM from 'react-dom';
import DefaultLayout from './components/default';
import Config from './config/configstub';

export default function init() {
  if (!window.config) window.config = Config;
  if (document.getElementById('gp-react-target') === null) {
    setTimeout(init, 1000);
  } else {
    ReactDOM.render(<DefaultLayout />, document.getElementById('gp-react-target'));
  }
}
