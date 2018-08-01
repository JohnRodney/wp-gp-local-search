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

export const distanceBetweenPlaces = (place1, place2, unit) => {
  const isGooglePlace = !!place1.geometry;
  const sin = n => Math.sin(n);
  const cos = n => Math.cos(n);
  const lat1 = isGooglePlace ? place1.geometry.location.lat() : place1.location.lat;
  const long1 = isGooglePlace ? place1.geometry.location.lng() : place1.location.lng;
  const lat2 = place2.geometry.location.lat();
  const long2 = place2.geometry.location.lng();
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = long1 - long2;
  const radtheta = Math.PI * theta / 180;
  let dist = sin(radlat1) * sin(radlat2) + cos(radlat1) * cos(radlat2) * cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === 'K') { dist *= 1.609344; }
  if (unit === 'N') { dist *= 0.8684; }
  return dist;
};
