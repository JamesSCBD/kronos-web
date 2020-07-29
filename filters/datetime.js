import { DateTime } from 'luxon';

function datetime(value) {
  return formatDate(value, 'yyyy-MM-dd hh:mm');
}

function date(value) {
  return formatDate(value, 'yyyy-MM-dd');
}

function time(value) {
  return formatDate(value, 'hh:mm');
}

function formatDate(value, format) {
  let dateValue = null;
  if (value) {
    if (DateTime.isDateTime(value)) dateValue = value;
    if (value.constructor === Date) dateValue = DateTime.fromJSDate(value);
    if (value.constructor === String) dateValue = DateTime.fromISO(value);
  }

  return dateValue ? dateValue.toFormat(format) : '';
}

export {
  datetime, date, time, formatDate,
};
