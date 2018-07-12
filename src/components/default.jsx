import React from 'react';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
import Map from './map';

export default class MapPlaceholder extends React.Component {
  constructor() {
    super();
    this.closeMap = this.closeMap.bind(this);
    this.state = {
      displayMap: true,
      isModal: false,
    };
  }

  getMap() {
    const { displayMap, isModal } = this.state;
    const isModalClassName = `map-container ${isModal ? 'is-modal' : ''}`;
    if (!displayMap) return <div />;

    return (
      <div className={isModalClassName}>
        { isModal ? <div className="map-mask" /> : null }
        <Map isModal={isModal} close={this.closeMap} />
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
    const { displayMap, isModal } = this.state;

    const modalLayout = (
      <div>
        <VelocityTransitionGroup enter={{ animation: 'slideDown' }} leave={{ animation: 'slideUp' }}>
          {displayMap ? this.getMap() : undefined}
        </VelocityTransitionGroup>
        <h1>{defaultName}</h1>
        <h3>{defaultAddress}</h3>
        <button
          type="button"
          onClick={() => this.openMap()}
        >
          Open Map
        </button>
      </div>
    );

    const layout = isModal ? modalLayout : this.getMap();

    return (
      <div className="default-map-container">
        {layout}
      </div>
    );
  }
}
