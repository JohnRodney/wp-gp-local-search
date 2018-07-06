import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Category from './category';
import Place from './place';

const modes = ['category-view', 'category-places'];

export default class CategoryList extends Component {
  constructor() {
    super();

    this.changePlace = this.changePlace.bind(this);
    this.state = {
      mode: modes[0],
    };
  }

  getPlaceTypes() {
    const { mode } = this.state;
    const { placeTypes } = this.props;

    if (mode !== modes[0]) return <div />;

    return placeTypes.map(type => (
      <div>
        <Category
          changePlace={this.changePlace}
          type={type}
        />
      </div>
    ));
  }

  getCategoryHeader() {
    const { mode } = this.state;
    const { activeType } = this.props;

    if (mode !== modes[1]) return <div />;

    return (
      <button
        type="button"
        className="category-header"
        onClick={() => this.setState({ mode: modes[0] })}
      >
        <i className="material-icons category-header-icon">chevron_left</i>
        <h1>{activeType}</h1>
      </button>
    );
  }

  getPlaces() {
    const { mode } = this.state;
    const { places } = this.props;

    if (mode !== modes[1]) return <div />;

    return (
      <div className="places-list">
        {
          places.map((place, i) => (
            i < 10 ? (
              <div className="a-place">
                <Place place={place} />
              </div>) : ''
          ))
        }
      </div>
    );
  }

  changePlace(place) {
    const { changePlace } = this.props;
    const mode = modes[1];

    changePlace(place);
    this.setState({ mode });
  }

  render() {
    const placeTypesList = this.getPlaceTypes();
    const placesList = this.getPlaces();
    const categoryHeader = this.getCategoryHeader();

    return (
      <div>
        { categoryHeader }
        { placesList }
        { placeTypesList }
      </div>
    );
  }
}

CategoryList.propTypes = {
  changePlace: PropTypes.func.isRequired,
  placeTypes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  activeType: PropTypes.string.isRequired,
  places: PropTypes.arrayOf(PropTypes.shape({
    formatted_address: PropTypes.string.isRequired,
    geometry: PropTypes.shape({
      location: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
      viewport: PropTypes.shape({
        east: PropTypes.number.isRequired,
        north: PropTypes.number.isRequired,
        south: PropTypes.number.isRequired,
        west: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    html_attributions: PropTypes.arrayOf(PropTypes.any).isRequired,
    icon: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    opening_hours: PropTypes.shape({
      open_now: PropTypes.bool.isRequired,
    }).isRequired,
    photos: PropTypes.arrayOf(PropTypes.shape({
      height: PropTypes.number.isRequired,
      html_attributions: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    place_id: PropTypes.string.isRequired,
    plus_code: PropTypes.shape({
      compound_code: PropTypes.string.isRequired,
      global_code: PropTypes.string.isRequired,
    }).isRequired,
    price_level: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    reference: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired).isRequired,
};
