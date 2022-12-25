import { filter } from '../utils/filter.js';

function generateFilteredEvents(eventPoints) {
  return Object.entries(filter).map(([filterType, filteredEvents]) =>
    ({
      type: filterType,
      count: filteredEvents(eventPoints).length
    }),
  );
}

export {generateFilteredEvents};
