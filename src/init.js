import React from 'react';
import ReactDOM from 'react-dom';
import MapComponent from './components/map';
import Config from './config/configstub';

export default function init() {
  window.config = Config;
  ReactDOM.render(<MapComponent />, document.getElementById('react-target'));
}
