import React from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import ReactDOM from 'react-dom';
import defaultMapStyles from '../config/map-styles';
import categoryToIconMap from '../config/icon-category-map';
import CategoryList from './category-list';
import { apartmentComplexMarker, getContentFromPlace } from '../utilities/utility-functions';

const initializeStarRating = () => {
  const ratingElement = document.getElementById('place-rating');
  const rating = parseFloat(ratingElement.innerHTML);

  ratingElement.innerHTML = '';
  ReactDOM.render(
    <StarRatings
      rating={rating}
      starDimension="20px"
      starRatedColor="#FBC02D"
      starSpacing="0"
    />,
    document.getElementById('rating-target'),
  );
};


export default class MapComponent extends React.Component {
  constructor() {
    super();
    const { config } = window;

    this.markers = [];
    this.changePlace = this.changePlace.bind(this);
    this.setInfoWindowFromPlace = this.setInfoWindowFromPlace.bind(this);
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

  setInfoWindowFromPlace(place) {
    const isSame = (p, m) => (
      m.position.lat() === p.geometry.location.lat()
      && m.position.lng() === p.geometry.location.lng()
    );
    const marker = this.markers.filter(mark => isSame(place, mark))[0];
    const content = getContentFromPlace(place);

    console.log(place)
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
    this.map.setCenter({ lat: marker.position.lat(), lng: marker.position.lng() });
    initializeStarRating();
  }

  setStyles() {
    const styles = defaultMapStyles;
    const { placeTypes } = this.state;

    this.map.setOptions({ styles });
    this.findLocalPlaces(placeTypes[0]);
  }

  initializeStarRating() {
    const ratingElement = document.getElementById('place-rating');
    const rating = parseFloat(ratingElement.innerHTML);
    ratingElement.innerHTML = '';
    ReactDOM.render(
      <StarRatings
        rating={rating}
        starDimension="20px"
        starRatedColor="#FBC02D"
        starSpacing="0"
      />,
      document.getElementById('rating-target'),
    );
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
      zoomControl: true,
      disableDefaultUI: true,
      zoom: 13,
    });

    this.infoWindow = new google.maps.InfoWindow();
    this.defaultPlace = place;
    this.defaultPlace.name = title;
    this.addMarker(location, title, apartmentComplexMarker, place, true);
    this.setStyles();
  }

  addDefaultLocationMarker() {
    const { defaultName } = window.config;

    this.addMarker(this.location, defaultName, apartmentComplexMarker, this.defaultPlace, true);
  }

  addMarker(location, title, iconType, place, disable) {
    const marker = new google.maps.Marker({
      map: this.map,
      position: location,
      title,
      animation: google.maps.Animation.DROP,
      icon: place.icon ? {
        url: place.icon,
        scaledSize: new google.maps.Size(20, 20),
      } : null,
    });

    if (disable) { return; }
    google.maps.event.addListener(marker, 'click', () => {
      const content = getContentFromPlace(place);
      this.infoWindow.setContent(content);
      this.infoWindow.open(this.map, marker);
      initializeStarRating();
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
    const { defaultFilters } = window.config;
    const { activeType } = this.state;
    const icon = categoryToIconMap[activeType];
    const filtered = res.filter((place) => {
      let needsRemoved = false;

      defaultFilters.forEach((filter) => {
        if (place.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
          needsRemoved = true;
        }
      });

      return !needsRemoved;
    });

    filtered.forEach(result => this.addMarker(result.geometry.location, result.name, icon, result));
    this.setState({ loading: false, places: filtered });
    this.resetZoomToMarkers();
  }

  changePlace(place) {
    const activeType = place.toLowerCase();

    this.clearMarkers();
    this.setState({ activeType, places: [] });
    this.findLocalPlaces(place);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.addDefaultLocationMarker();
  }

  resetZoomToMarkers() {
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => bounds.extend(marker.getPosition()));

    this.map.fitBounds(bounds);
  }

  render() {
    const {
      loading, placeTypes, activeType, places,
    } = this.state;
    const loader = loading ? <div className="loader" /> : '';
    const { close, isModal } = this.props;
    const isModalClassName = `map-component-modal ${isModal ? 'is-modal' : ''}`;
    const isModalConetentClassName = `map-modal-content ${isModal ? 'is-modal' : ''}`;
    const closeButton = isModal ? (
      <button
        type="button"
        className="close-map"
        onClick={() => close()}
      >
        <i className="material-icons">close</i>
      </button>
    ) : null;

    return (
      <div className={isModalClassName}>
        { closeButton }
        { loader }
        <div className={isModalConetentClassName}>
          <div className="places-menu">
            <CategoryList
              setInfoWindowFromPlace={this.setInfoWindowFromPlace}
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
  isModal: PropTypes.bool.isRequired,
};
