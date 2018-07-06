import React from 'react';
import PropTypes from 'prop-types';

export default function Place(props) {
  const { place } = props;
  return (
    <div>
      <div className="a-place-name">{ place.name }</div>
      <div className="a-place-address">{ place.formatted_address }</div>
    </div>
  );
}

Place.propTypes = {
  place: PropTypes.shape({
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
  }).isRequired,
};
