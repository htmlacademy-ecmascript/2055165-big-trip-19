const EventTypes = {
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

const EVENT_TYPES_LIST = Object.values(EventTypes);

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const EmptyListMessages = {
  [FilterTypes.EVERYTHING]:'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no past events now'
};

const ActionTypes = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateLevels = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};


const DEFAULT_EVENT_TYPE = EventTypes.FLIGHT;
const DEFAULT_FILTER_TYPE = FilterTypes.EVERYTHING;
const DEFAULT_SORT_TYPE = SortTypes.DAY;

const DISABLED_SORT_TYPES = [SortTypes.EVENT, SortTypes.OFFER];

export { EventTypes, FilterTypes, SortTypes, EmptyListMessages, ActionTypes, UpdateLevels, EVENT_TYPES_LIST, DEFAULT_EVENT_TYPE, DEFAULT_FILTER_TYPE, DEFAULT_SORT_TYPE, DISABLED_SORT_TYPES };
