import React from 'react';
import ReactDOM from 'react-dom';
import DefaultLayout from './components/default';
import Config from './config/configstub';

export default function init() {
  if (!window.config) window.config = Config;
  console.log('looking for target')
  if (document.getElementById('gp-react-target') === null) {
    console.log('no target found')
    setTimeout(init, 1000);
  } else {
    console.log('found target', document.getElementById('gp-react-target'))
    ReactDOM.render(<DefaultLayout />, document.getElementById('gp-react-target'));
  }
}
