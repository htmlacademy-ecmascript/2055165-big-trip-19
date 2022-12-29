import { getRandomEventMocks, destinationMocks, offerMocks } from '../mock/mock-event-point.js';

const EVENT_POINTS_COUNT = 9;

export default class PointsModel {
  #eventPoints = null;
  #destinations = null;
  #offers = null;

  constructor() {
    this.#destinations = destinationMocks;
    this.#offers = offerMocks;

    const dataEventPoints = getRandomEventMocks(EVENT_POINTS_COUNT);
    const offers = structuredClone(this.#offers);

    dataEventPoints.forEach((point) => {
      const pointDestination = this.#destinations.find((dest) => dest.id === point.destination);
      point.destination = pointDestination ? pointDestination : null;

      const typeOffers = offers.find((typeOffer) => typeOffer.type === point.type);
      typeOffers.offers.forEach((offer) => {offer.checked = point.offers.includes(offer.id);});
      point.offers = typeOffers.offers;
    });

    this.#eventPoints = dataEventPoints;
  }

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
