import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const formatDateTime = (date, format) => dayjs(date).format(format).toUpperCase();

const getTimeDuration = (startTime, endTime) => {
  const timeDifference = dayjs.duration(dayjs(endTime).second(0).diff(dayjs(startTime).second(0)));
  return timeDifference.format(`${timeDifference.days() === 0 ? '' : 'DD[D] '}${timeDifference.days() === 0 && timeDifference.hours() === 0 ? '' : 'HH[H] '}mm[M]`);
};

const isPastEvent = (startTime, endTime) => (startTime && endTime) && (dayjs().isAfter(dayjs(endTime), 'minute'));

const isPresentEvent = (startTime, endTime) => (startTime && endTime) && (dayjs().isSameOrAfter(dayjs(startTime), 'minute')) && (dayjs().isSameOrBefore(dayjs(endTime), 'minute'));

const isFutureEvent = (startTime, endTime) => (startTime && endTime) && (dayjs().isBefore(dayjs(startTime), 'minute'));

// точки маршрута по умолчанию располагаются сверху вниз
// от самых старых к самым новым по датам начала событий.
// А если дата начала двух и более точек совпадает,
// расположение этих точек относительно друг друга реализуется на усмотрение разработчика.
const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom), 'minute');

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortByTime = (pointA, pointB) => {
  const durationPointA = dayjs.duration(dayjs(pointA.dateTo).second(0).diff(dayjs(pointA.dateFrom).second(0))).asMinutes();
  const durationPointB = dayjs.duration(dayjs(pointB.dateTo).second(0).diff(dayjs(pointB.dateFrom).second(0))).asMinutes();

  return durationPointB - durationPointA;

};

export {formatDateTime, getTimeDuration, isPastEvent, isPresentEvent, isFutureEvent, sortByDay, sortByPrice, sortByTime};
