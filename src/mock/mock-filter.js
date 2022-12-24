import { filter } from '../utils/filter.js';

function generateFilterEvents(eventPoints) {
  return Object.entries(filter).map(([filterType, filterEvents]) =>
    ({
      type: filterType,
      count: filterEvents(eventPoints).length
    }),
  );
}

export {generateFilterEvents};
