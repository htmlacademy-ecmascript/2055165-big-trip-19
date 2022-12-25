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
  return timeDifference.format(`${timeDifference.$d.days === 0 ? '' : 'DD[D] '}${timeDifference.$d.days === 0 && timeDifference.$d.hours === 0 ? '' : 'HH[H] '}mm[M]`);
};

const isPastEvent = (startTime, endTime) => (startTime && endTime) && (dayjs().isAfter(dayjs(endTime), 'minute'));

const isPresentEvent = (startTime, endTime) => (startTime && endTime) && (dayjs().isSameOrAfter(dayjs(startTime), 'minute')) && (dayjs().isSameOrBefore(dayjs(endTime), 'minute'));

const isFutureEvent = (startTime, endTime) => (startTime && endTime) && (dayjs().isBefore(dayjs(startTime), 'minute'));

export {formatDateTime, getTimeDuration, isPastEvent, isPresentEvent, isFutureEvent};
