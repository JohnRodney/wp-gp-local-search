import React, { Component } from 'react';

export default class Category extends Component {
  render() {
    const { changePlace, place } = this.props;
    return (
      <div
        className="place-type-option"
        onClick={() => changePlace(place)}
      >
        { place.substring(0, 1).toUpperCase() + place.substring(1, place.length) }
        <i className="material-icons category-list-icon">chevron_right</i>
      </div>
    );
  }
}
