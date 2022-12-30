import { mockDestinations } from '../mock/mock-event-point.js';

export default class DestinationsModel {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }
}
