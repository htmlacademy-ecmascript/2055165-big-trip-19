import { FilterType } from '../constants.js';
import { isFutureEvent, isPresentEvent, isPastEvent } from './point-event-utils.js';

const filter = {
  [FilterType.EVERYTHING]: (eventPoints) => eventPoints,
  [FilterType.FUTURE]: (eventPoints) => eventPoints.filter((point) => isFutureEvent(point.dateFrom, point.dateTo)),
  [FilterType.PRESENT]: (eventPoints) => eventPoints.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (eventPoints) => eventPoints.filter((point) => isPastEvent(point.dateFrom, point.dateTo))
};

export { filter };
