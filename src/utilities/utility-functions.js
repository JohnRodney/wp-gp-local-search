export const apartmentComplexMarker = 'home';

export const colorFromRating = (ratingString) => {
  const rating = parseFloat(ratingString);
  if (rating > 4.0) {
    return 'green';
  } if (rating > 3.5) {
    return 'orange';
  } return 'red';
};

export const getContentFromPlace = place => (`
  <div class="scroll-fix info-window-container" >
    <strong class="info-window-name">${place.name}</strong><br />
    <div class="info-window-right">
      <div id="rating-target"></div>
      ${place.rating ? `<div id="place-rating">${place.rating}</div>` : ''}
    </div>
    <p>${place.formatted_address}</p>
    <div class="info-window-img-container" style="background-image: url(${place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxwidth: '1000', maxHeight: '1000' }) : ''});">
    </div>
  </div>
`);
