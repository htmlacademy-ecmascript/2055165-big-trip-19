const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const FILTER_TYPES = ['everything', 'future', 'present', 'past'];
const SORT_TYPES = ['day', 'event', 'time', 'price', 'offer'];

const EMPTY_LIST_MESSAGES = {
  'everything':'Click New Event to create your first point',
  'future': 'There are no past events now',
  'present': 'There are no present events now',
  'past': 'There are no future events now'
};

export { EVENT_TYPES, FILTER_TYPES, SORT_TYPES, EMPTY_LIST_MESSAGES };
