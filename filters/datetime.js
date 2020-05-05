import { DateTime } from 'luxon';

function datetime(value) {
  return toDateFormat(value, 'yyyy-MM-dd hh:mm');
}

function date(value) {
  return toDateFormat(value, 'yyyy-MM-dd');
}

function time(value) {
  return toDateFormat(value, 'hh:mm');
}

function toDateFormat(value, format) {
  let dateValue = null;
  if (value) {
    if (DateTime.isDateTime(value)) dateValue = value;
    if (value.constructor === Date) dateValue = DateTime.fromJSDate(value);
    if (value.constructor === String) dateValue = DateTime.fromISO(value);
  }

  return dateValue ? dateValue.toFormat(format) : '';
}

export { datetime, date, time };
