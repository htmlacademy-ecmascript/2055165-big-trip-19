import { getRandomEventMocks } from '../mock/mock-event-point.js';

const EVENT_POINTS_COUNT = 5;

export default class EventPointsModel {
  eventPoints = getRandomEventMocks(EVENT_POINTS_COUNT);

  getEventPoints() {
    return this.eventPoints;
  }
}
