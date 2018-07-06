import React from 'react';
import PropTypes from 'prop-types';
import defaultMapStyles from '../config/map-styles';
import categoryToIconMap from '../config/icon-category-map';
import CategoryList from './category-list';

const apartmentComplexMarker = 'home';

export default class MapComponent extends React.Component {
  constructor() {
    super();
    const { config } = window;

    this.markers = [];
    this.changePlace = this.changePlace.bind(this);
    this.state = {
      placeTypes: config.defaultTypes,
      loading: false,
      activeType: config.defaultTypes[0],
      places: [],
    };
  }

  componentDidMount() {
    const { config } = window;

    this.initMapFromConfig(config.defaultAddress);
  }

  setStyles() {
    const styles = defaultMapStyles;
    const { placeTypes } = this.state;

    this.map.setOptions({ styles });
    this.findLocalPlaces(placeTypes[0]);
  }

  initMapFromConfig(address) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address }, (res) => {
      this.makeMapFromLocation(res[0].geometry.location, res[0]);
    });
  }

  makeMapFromLocation(location, place) {
    const { config } = window;
    const title = config.defaultName;

    this.location = location;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      disableDefaultUI: true,
      zoom: 13,
    });

    this.infoWindow = new google.maps.InfoWindow();
    this.defaultPlace = place;

    this.addMarker(location, title, apartmentComplexMarker, place);
    this.setStyles();
  }

  addDefaultLocationMarker() {
    const { defaultName } = window.config;

    this.addMarker(this.location, defaultName, apartmentComplexMarker, this.defaultPlace);
  }

  addMarker(location, title, iconType, place) {
    const marker = new google.maps.Marker({
      map: this.map,
      position: location,
      title,
      label: {
        fontFamily: 'Material Icons',
        color: 'white',
        text: iconType,
      },
    });

    google.maps.event.addListener(marker, 'click', () => {
      const content = `
        <div>
          <strong>${place.name}</strong><br>
          <p>${place.formatted_address}</p><br>
          <img src="${place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxwidth: '100', maxHeight: '100' }) : ''}" />
          <p>${place.opening_hours && place.opening_hours.open_now ? 'open' : 'closed'}<p>
          <p>${place.rating} stars<p>
        </div>
      `;

      this.infoWindow.setContent(content);
      this.infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
  }

  findLocalPlaces(query) {
    this.setState({ loading: true });

    const service = new google.maps.places.PlacesService(this.map);
    const { location } = this;
    const request = {
      location,
      rankBy: google.maps.places.RankBy.DISTANCE,
      query,
    };

    service.textSearch(request, this.addMarkersFromNearbySearchResult.bind(this));
  }

  addMarkersFromNearbySearchResult(res) {
    const { activeType } = this.state;
    const icon = categoryToIconMap[activeType];

    res.forEach(result => this.addMarker(result.geometry.location, result.name, icon, result));
    this.setState({ loading: false, places: res });
  }

  changePlace(place) {
    const activeType = place.toLowerCase();

    this.clearMarkers();
    this.setState({ activeType });
    this.findLocalPlaces(place);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.addDefaultLocationMarker();
  }

  render() {
    const {
      loading, placeTypes, activeType, places,
    } = this.state;
    const loader = loading ? <div className="loader" /> : '';
    const { close } = this.props;

    return (
      <div className="map-component-modal">
        <button
          type="button"
          className="close-map"
          onClick={() => close()}
        >
          <i className="material-icons">close</i>
        </button>
        { loader }
        <div className="map-modal-content">
          <div className="places-menu">
            <CategoryList
              placeTypes={placeTypes}
              changePlace={this.changePlace}
              activeType={activeType}
              places={places}
            />
          </div>
          <div className="map" id="map" />
        </div>
      </div>
    );
  }
}

MapComponent.propTypes = {
  close: PropTypes.func.isRequired,
};
