import moment from 'moment';

function datetime(value) {
  return value ? moment(value).format('YYYY-MM-DD HH:mm') : '';
}

function date(value) {
  return value ? moment(value).format('YYYY-MM-DD') : '';
}

function time(value) {
  return value ? moment(value).format('HH:mm') : '';
}

export { datetime, date, time };
