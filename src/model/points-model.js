import { getRandomEventMocks, destinationMocks, offerMocks } from '../mock/mock-event-point.js';

const EVENT_POINTS_COUNT = 5;

export default class PointsModel {
  #eventPoints = getRandomEventMocks(EVENT_POINTS_COUNT);
  #destinations = destinationMocks;
  #offers = offerMocks;

  get eventPoints() {
    return this.#eventPoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
