import { mockOffers } from '../mock/mock-event-point.js';

export default class OffersModel {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }
}
