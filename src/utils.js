import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

dayjs.extend(duration);

const getRandomIntNumber = (min, max) => {
  if ((!Number.isFinite(min) || !Number.isFinite(max)) || (min < 0 || max < 0)) {
    return NaN;
  }

  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
};

const getRandomArrElement = (array) => array[getRandomIntNumber(0, array.length - 1)];

const getUniqueRandomArrElements = (elementsCount, sourceArray) => {
  const uniqueSourceArray = Array.from(new Set(sourceArray));

  if (elementsCount > uniqueSourceArray.length) {
    return uniqueSourceArray;
  }

  const resultElements = [];

  for (let i = 0; i < elementsCount; i++) {
    let element = getRandomArrElement(uniqueSourceArray);
    while (resultElements.includes(element)){
      element = getRandomArrElement(uniqueSourceArray);
    }

    resultElements.push(element);
  }

  return resultElements;
};

const formatDateTime = (date, format) => dayjs(date).format(format).toUpperCase();

const getTimeDuration = (startTime, endTime) => {
  const timeDifference = dayjs.duration(dayjs(endTime).second(0).diff(dayjs(startTime).second(0)));
  return timeDifference.format(`${timeDifference.$d.days === 0 ? '' : 'DD[D] '}${timeDifference.$d.days === 0 && timeDifference.$d.hours === 0 ? '' : 'HH[H] '}mm[M]`);
};

const addCalendarOnInput = (inputElement) => flatpickr(inputElement, {});

export { getRandomIntNumber, getRandomArrElement, getUniqueRandomArrElements, formatDateTime, getTimeDuration, addCalendarOnInput };
