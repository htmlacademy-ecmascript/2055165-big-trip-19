import Observable from '../framework/observable.js';
import {getRandomMockEvents} from '../mock/mock-event-point.js';

const EVENT_POINTS_COUNT = 9;

export default class PointsModel extends Observable {
  #eventPoints = null;

  constructor(destinations, offers) {
    super();
    const eventPoints = getRandomMockEvents(EVENT_POINTS_COUNT).map((point) => {
      const destination = destinations.find((dest) => dest.id === point.destination) ?? null;
      const typeOffers = offers.find((typeOffer) => typeOffer.type === point.type);
      return {
        ...point,
        destination,
        offers: typeOffers ? typeOffers.offers.map((offer) => ({...offer, checked: point.offers.includes(offer.id)})) : []
      };
    });

    this.#eventPoints = eventPoints;
  }

  get eventPoints() {
    return this.#eventPoints;
  }

  updatePoint(updateLevel, updatedPoint) {
    const index = this.#eventPoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event point');
    }

    this.#eventPoints = [
      ...this.#eventPoints.slice(0, index),
      updatedPoint,
      ...this.#eventPoints.slice(index + 1)
    ];

    this._notify(updateLevel, updatedPoint);
  }

  addNewPoint(updateLevel, updatedPoint) {

    this.#eventPoints = [
      updatedPoint,
      ...this.#eventPoints
    ];

    this._notify(updateLevel, updatedPoint);
  }

  deletePoint(updateLevel, updatedPoint) {
    const index = this.#eventPoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event point');
    }

    this.#eventPoints = [
      ...this.#eventPoints.slice(0, index),
      ...this.#eventPoints.slice(index + 1)
    ];

    this._notify(updateLevel, updatedPoint);
  }
}
