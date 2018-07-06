import React, { Component } from 'react';

export default class Place extends Component {
  render() {
    const { place } = this.props;
    return (
      <div>
        <div className="a-place-name">{ place.name }</div>
        <div className="a-place-address">{ place.formatted_address }</div>
      </div>
    );
  }
}
