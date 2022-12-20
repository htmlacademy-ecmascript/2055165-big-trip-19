const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SORT_TYPES = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const EMPTY_LIST_MESSAGES = {
  [FILTER_TYPES.EVERYTHING]:'Click New Event to create your first point',
  [FILTER_TYPES.FUTURE]: 'There are no past events now',
  [FILTER_TYPES.PRESENT]: 'There are no present events now',
  [FILTER_TYPES.PAST]: 'There are no future events now'
};

export { EVENT_TYPES, FILTER_TYPES, SORT_TYPES, EMPTY_LIST_MESSAGES };
