import React from 'react';
import defaultMapStyles from '../config/map-styles';

export default class MapComponent extends React.Component {
  constructor(){
    super();
    const { config } = window;
    this.markers = [];

    this.state = {
      placeTypes: config.defaultTypes,
      loading: false,
    }
  }

  initMapFromConfig(address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (res, status) => {
      this.makeMapFromLocation(res[0].geometry.location);
    });
  }

  makeMapFromLocation(location){
    const { config } = window;
    const title = config.defaultName;
    this.location = location;
    /* Create a map object and specify the DOM element
       for display. */
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 13
    });

    // Create a marker and set its position.
    this.addMarker(location, title);

    this.setStyles();
  }

  addDefaultLocationMarker() {
    const { defaultName } = window.config;
    this.addMarker(this.location, defaultName);
  }

  addMarker(location, title) {
    const { Size, Point } = google.maps;
    this.markers.push(new google.maps.Marker({
      map: this.map,
      position: location,
      title
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
    res.forEach(result => this.addMarker(result.geometry.location, result.name));
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
    this.clearMarkers();
    this.findLocalPlaces(place);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = [];
    this.addDefaultLocationMarker();
  }

  render() {
    const loader = this.state.loading ? <div className="loader">Loading...</div> : '';
    return (
      <div>
        { loader }
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
    );
  }
}
