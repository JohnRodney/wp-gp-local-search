import React from 'react';
import ReactDOM from 'react-dom';
import MapComponent from './components/map';

export default function init() {
  ReactDOM.render(<MapComponent />, document.getElementById('react-target'));
}
