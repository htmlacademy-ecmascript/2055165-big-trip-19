import dayjs from 'dayjs';

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

const convertDurationTime = (minutesAmount) => {
  let minutes = Math.floor(minutesAmount % 60);
  let hours = Math.floor((minutesAmount / 60) % 24);
  let days = Math.floor((minutesAmount / 60 / 24));

  if (days) {
    days = days.toString().padStart(2,'0').concat('D');
    hours = hours.toString().padStart(2,'0').concat('H');
  } else if (hours) {
    days = '';
    hours = hours.toString().padStart(2,'0').concat('H');
  } else {
    days = '';
    hours = '';
  }

  minutes = minutes.toString().padStart(2,'0').concat('M');

  return [days, hours, minutes].join(' ').trim();
};

const formatDateTime = (date, format) => dayjs(date).format(format).toUpperCase();

const getTimeDifference = (startTime, endTime, timeUnit) => dayjs(endTime).second(0).diff(dayjs(startTime).second(0),timeUnit);


export { getRandomIntNumber, getRandomArrElement, getUniqueRandomArrElements, convertDurationTime, formatDateTime, getTimeDifference };
