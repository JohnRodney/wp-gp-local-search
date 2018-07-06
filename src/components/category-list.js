import React, { Component } from 'react';
import Category from './category';
import Place from './place';

const modes = ['category-view', 'category-places']
export default class CategoryList extends Component {
  constructor() {
    super();
    this.state = {
      mode: modes[0],
    };
  }

  changePlace(place) {
    const { changePlace } = this.props;
    const mode = modes[1];

    changePlace(place);
    this.setState({ mode });
  }

  getPlaceTypes() {
    if (this.state.mode !== modes[0]) return <div />;

    const { placeTypes, changePlace } = this.props;

    return placeTypes.map(place => {
      return (
        <div>
          <Category
            changePlace={this.changePlace.bind(this)}
            place={place}
          />
        </div>
      )
    });
  }

  getCategoryHeader() {
    if (this.state.mode !== modes[1]) return <div />
    const { activeType } = this.props;

    return (
      <div
        className="category-header"
        onClick={() => this.setState({ mode: modes[0] })}
      >
        <i className="material-icons category-header-icon">chevron_left</i>
        <h1>{activeType}</h1>
      </div>
    );
  }

  getPlaces() {
    if (this.state.mode !== modes[1]) return <div />

    const { places } = this.props;
    return (
      <div className='places-list'>
        {
          places.map((place, i)=> (
            i < 10 ? (
            <div className="a-place">
              <Place place={place} />
            </div> ) : ''
          ))
        }
      </div>
    )
  }

  render() {
    const placeTypesList = this.getPlaceTypes();
    const placesList = this.getPlaces();
    const categoryHeader = this.getCategoryHeader();

    return (
      <div>
        { categoryHeader }
        { placesList }
        { placeTypesList }
      </div>
    );
  }
}
