import moment from 'moment';

let toLonLat, toStringHDMS;

if (__CLIENT__ && !toLonLat && !toStringHDMS) {
  toLonLat = require('ol/proj').toLonLat;
  toStringHDMS = require('ol/coordinate').toStringHDMS;
}

export const getDate = (field) => {
  if (!field) return '-';
  if (Date.parse(field) > 0) {
    return moment(field).format('DD MMM YYYY');
  }
};

export const getLonLat = (point) => {
  if (!point) return '-';
  const coordinates = point.slice(7)?.slice(0, -1)?.split(' ');
  if (!coordinates || !toLonLat || !toStringHDMS) return '-';
  return toStringHDMS(toLonLat(coordinates));
};
