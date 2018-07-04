import React from 'react';
import defaultMapStyles from '../config/map-styles';
import categoryToIconMap from '../config/icon-category-map';

const apartmentComplexMarker = 'home';

export default class MapComponent extends React.Component {
  constructor() {
    super();
    const { config } = window;

    this.markers = [];
    this.state = {
      placeTypes: config.defaultTypes,
      loading: false,
      activeType: config.defaultTypes[0],
    }
  }

  initMapFromConfig(address) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address }, (res, status) => {
      this.makeMapFromLocation(res[0].geometry.location);
    });
  }

  makeMapFromLocation(location) {
    const { config } = window;
    const title = config.defaultName;

    this.location = location;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      disableDefaultUI: true,
      zoom: 13
    });

    this.addMarker(location, title, apartmentComplexMarker);
    this.setStyles();
  }

  addDefaultLocationMarker() {
    const { defaultName } = window.config;

    this.addMarker(this.location, defaultName, apartmentComplexMarker);
  }

  addMarker(location, title, iconType) {
    const { Size, Point } = google.maps;

    this.markers.push(new google.maps.Marker({
      map: this.map,
      position: location,
      title,
      label: {
        fontFamily: 'Material Icons',
        color: 'white',
        text: iconType,
      }
    }));
  }

  findLocalPlaces(query) {
    this.setState({ loading: true })

    const service = new google.maps.places.PlacesService(this.map);
    const { location } = this;
    const request = {
      location,
      rankBy: google.maps.places.RankBy.DISTANCE,
      query
    };

    service.textSearch(request, this.addMarkersFromNearbySearchResult.bind(this));
  }

  addMarkersFromNearbySearchResult(res) {
    const icon = categoryToIconMap[this.state.activeType];

    res.forEach(result => this.addMarker(result.geometry.location, result.name, icon));
    this.setState({ loading: false })
  }

  setStyles() {
    const styles = defaultMapStyles;

    this.map.setOptions({ styles })
    this.findLocalPlaces(this.state.placeTypes[0]);
  }

  componentDidMount() {
    const { config } = window;

    this.initMapFromConfig(config.defaultAddress);
  }

  changePlace(place) {
    const activeType = place.toLowerCase();

    this.clearMarkers();
    this.setState({ activeType })
    this.findLocalPlaces(place);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = [];
    this.addDefaultLocationMarker();
  }

  render() {
    const loader = this.state.loading ? <div className="loader">Loading...</div> : '';
    const { close } = this.props;

    return (
      <div className="map-component-modal">
        <div
          className="close-map"
          onClick={() => this.props.close()}
        >
        <i class="material-icons">close</i>
        </div>
        { loader }
        <div className="map-modal-content">
          <div className="places-menu">
            {
              this.state.placeTypes.map(place => {
                return (
                  <div
                    className="place-type-option"
                    onClick={() => this.changePlace(place)}
                  >
                    { place.substring(0, 1).toUpperCase() + place.substring(1, place.length) }
                  </div>
                )
              })
            }
          </div>
          <div className="map" id="map"></div>
        </div>
      </div>
    );
  }
}
