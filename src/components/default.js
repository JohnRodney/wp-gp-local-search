import React from 'react';
import Map from './map';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

export default class MapPlaceholder extends React.Component{
  constructor() {
    super();
    this.state = {
      displayMap: false,
    };
  }

  getMap() {
    if (!this.state.displayMap) return <div></div>;
    return (
      <div className="map-container">
        <div className="map-mask"></div>
        <Map close={this.closeMap.bind(this)} />
      </div>
    );
  }

  closeMap() {
    const displayMap = false;
    this.setState({ displayMap });
  }

  openMap() {
    const displayMap = true;
    this.setState({ displayMap });
  }

  render() {
     const { defaultAddress, defaultName } = window.config;
     const map = this.getMap();

     return (
       <div className="default-map-container">
         <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
           {this.state.displayMap ? this.getMap() : undefined}
         </VelocityTransitionGroup>
         <h1>{defaultAddress}</h1>
         <h3>{defaultName}</h3>
         <button
           onClick={() => this.openMap()}
         >
           Open Map
         </button>
       </div>
     );
  }
}
