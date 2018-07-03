import React from 'react';

export default class MapComponent extends React.Component {
  constructor(){
    super();
    this.latlong = {lat: -25.363, lng: 131.044};
  }

  componentDidMount() {
    /* Create a map object and specify the DOM element
       for display. */

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.latlong,
      zoom: 4
    });

    // Create a marker and set its position.

    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.latlong,
      title: 'Google Places Map'
    });
  }

  render() {
    return (
      <div>
        <div id="map"></div>
      </div>
    );
  }
}
