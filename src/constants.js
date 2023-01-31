const EventType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECKIN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const EVENT_TYPES_LIST = Object.values(EventType);

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const EmptyListMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

const PointActionType = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE'
};

const UpdateLevel = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};


const DEFAULT_EVENT_TYPE = EventType.FLIGHT;
const DISABLED_SORT_TYPES = [SortType.EVENT, SortType.OFFER];

export { EventType, FilterType, SortType, EmptyListMessage, PointActionType, UpdateLevel, EVENT_TYPES_LIST, DEFAULT_EVENT_TYPE, DISABLED_SORT_TYPES };
