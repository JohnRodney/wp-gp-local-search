import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VelocityTransitionGroup } from 'velocity-react';
import Category from './category';
import Place from './place';

require('velocity-animate/velocity.ui');

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
    const { places, setInfoWindowFromPlace } = this.props;

    if (mode !== modes[1]) return <div />;

    const placesLayout = places.map((place, i) => (
      i < 100 ? (
        <div className="a-place">
          <Place setInfoWindowFromPlace={setInfoWindowFromPlace} place={place} />
        </div>) : ''
    ));

    return (
      <div className="places-list">
        <VelocityTransitionGroup
          enter={{ animation: 'transition.bounceLeftIn', stagger: '50' }}
          leave={{ animation: 'transition.bounceLeftOut' }}
        >
          { placesLayout.length > 0 ? placesLayout : undefined }
        </VelocityTransitionGroup>
      </div>
    );
  }

  changePlace(place) {
    const { changePlace } = this.props;
    const mode = modes[1];

    changePlace(place);
    this.setState({ mode });
  }

  asListView() {
    const placeTypesList = this.getPlaceTypes();
    const placesList = this.getPlaces();
    const categoryHeader = this.getCategoryHeader();

    return (
      <div>
        { categoryHeader }
        { placesList }
        <VelocityTransitionGroup
          enter={{ animation: 'transition.bounceLeftIn', stagger: '50' }}
          leave={{ animation: 'transition.bounceLeftOut' }}
        >
          { placeTypesList }
        </VelocityTransitionGroup>

      </div>
    );
  }

  dropDownChange(e) {
    const newPlaceType = e.currentTarget.options[e.currentTarget.selectedIndex].text;
    this.changePlace(newPlaceType);
  }

  asDropDown() {
    const { placeTypes } = this.props;

    return (
      <div className="category-list-drop-down">
        <select
          className="gp-search-places-dropdown"
          onChange={e => this.dropDownChange(e)}
        >
          {
            placeTypes.map(type => (
              <option value={type}>{type}</option>
            ))
          }
        </select>
      </div>
    );
  }

  render() {
    const { listView } = this.props;
    const listViewLayout = this.asListView();
    const dropDownLayout = this.asDropDown();

    const content = listView ? listViewLayout : dropDownLayout;

    return (
      <div>
        { content }
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
  setInfoWindowFromPlace: PropTypes.func.isRequired,
  listView: PropTypes.bool.isRequired,
};
