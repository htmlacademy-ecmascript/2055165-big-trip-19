import { FilterTypes } from '../constants.js';
import { isFutureEvent, isPresentEvent, isPastEvent } from './point-event-utils.js';

const filter = {
  [FilterTypes.EVERYTHING] : (eventPoints) => eventPoints,
  [FilterTypes.FUTURE] : (eventPoints) => eventPoints.filter((point) => isFutureEvent(point.dateFrom, point.dateTo)),
  [FilterTypes.PRESENT] : (eventPoints) => eventPoints.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
  [FilterTypes.PAST] : (eventPoints) => eventPoints.filter((point) => isPastEvent(point.dateFrom, point.dateTo))
};

export {filter};
