import {getRandomMockEvents} from '../mock/mock-event-point.js';

const EVENT_POINTS_COUNT = 9;

export default class PointsModel {
  #eventPoints = null;

  constructor(destinations, offers) {

    const eventPoints = getRandomMockEvents(EVENT_POINTS_COUNT).map((point) => {
      const destination = destinations.find((dest) => dest.id === point.destination) ?? null;
      const typeOffers = offers.find((typeOffer) => typeOffer.type === point.type);
      return {
        ...point,
        destination,
        offers: typeOffers.offers.map((offer) => ({...offer, checked: point.offers.includes(offer.id)}))
      };
    });

    this.#eventPoints = eventPoints;
  }

  get eventPoints() {
    return this.#eventPoints;
  }
}
