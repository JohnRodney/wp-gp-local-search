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
  <div class="scroll-fix info-window-container">
    <strong class="info-window-name">${place.name}</strong>
    <div class="info-window-right">
      <div
        class="${place.opening_hours && place.opening_hours.open_now ? 'green' : 'red'}"
      >
        ${place.opening_hours && place.opening_hours.open_now ? 'open' : 'closed'}
      </div>
      ${place.rating ? `<div class="${colorFromRating(place.rating)}">${place.rating} <i class="material-icons info-window-star">star_rate</i></div>` : ''}
    </div>
    <p>${place.formatted_address}</p><br>
    <div class="info-window-img-container">
      <img class="info-window-img" src="${place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxwidth: '500', maxHeight: '500' }) : ''}" />
    </div>
  </div>
`);
