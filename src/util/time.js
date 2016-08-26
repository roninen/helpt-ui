import moment from 'moment';
import _ from 'underscore';

export const LINK_DATEFORMAT = 'YYYY-MM-DD';

export function formatHumanDate(date) {
  return date.format('dddd LL');
}

export function today() {
  return moment().format(LINK_DATEFORMAT);
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
  return Math.floor(hours * 60);
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


export function round (floatVal, stepOption) {
    const step = (stepOption || 0.25);
    if (1 % step != 0) {
      return floatVal;
    }

    const num = floatVal.toFixed(2);
    const whole = Math.floor(floatVal);
    const fract = num - whole;

    let returnValue = null;
    const steps = _.range(step/2, 1, step);
    for (let i = 0; i < steps.length; i++) {
      if (fract < steps[i]) {
        returnValue = whole + step * i;
        break;
      }
    }
    if (returnValue == null) {
      returnValue = whole + 1;
    }
    if (returnValue > 18) {
      returnValue = 18;
    }
    return returnValue;
  }
