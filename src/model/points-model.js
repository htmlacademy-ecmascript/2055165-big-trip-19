import { getRandomEventMocks, destinationMocks, offerMocks } from '../mock/mock-event-point.js';

const EVENT_POINTS_COUNT = 5;

export default class PointsModel {
  eventPoints = getRandomEventMocks(EVENT_POINTS_COUNT);
  destinations = destinationMocks;
  offers = offerMocks;

  getEventPoints() {
    return this.eventPoints;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
