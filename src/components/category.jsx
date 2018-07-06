import React from 'react';
import PropTypes from 'prop-types';

export default function Category(props) {
  const { changePlace, type } = props;
  return (
    <button
      type="button"
      className="place-type-option"
      onClick={() => changePlace(type)}
    >
      { type.substring(0, 1).toUpperCase() + type.substring(1, type.length) }
      <i className="material-icons category-list-icon">chevron_right</i>
    </button>
  );
}

Category.propTypes = {
  changePlace: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
