import moment from 'moment';

export const K_DATEFORMAT = 'YYYY-MM-DD';

export function formatHumanDate(date) {
  return date.format('dddd LL');
}

export function today() {
  return '2016-08-02';
}

export function isFuture(momentDate) {
  // TODO: change to moment() aka today
  return moment(today()).diff(momentDate, 'days') < 0;
}

export function isToday(momentDate) {
  return moment(today()).diff(momentDate, 'days') == 0;
}

export function minutesToHours (minutes) {
  return minutes / 60;
}

export function hoursToMinutes (hours) {
  if (typeof hours !== 'number') {
    hours = parseFloat(hours);
  }
  return hours * 60;
}

export function formatHours (hours) {
  const full = Math.trunc(hours);
  const fract = hours % 1;
  let fractString;
  switch (fract) {
    case 0.75: fractString = String.fromCharCode(190); break;
    case 0.5: fractString = String.fromCharCode(189); break;
    case 0.25: fractString = String.fromCharCode(188); break;
    case 0: fractString = ''; break;
    default: return hours;
  }
  return `${full}${fractString}`;
}
