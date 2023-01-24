import Observable from '../framework/observable.js';
import { UpdateLevels } from '../constants.js';

export default class PointsModel extends Observable {
  #tripDataApiService = null;

  #destinations = [];
  #offers = [];
  #eventPoints = [];

  constructor(tripDataApiService) {
    super();
    this.#tripDataApiService = tripDataApiService;
  }

  async init() {
    try {
      const eventPoints = await this.#tripDataApiService.eventPoints;
      this.#destinations = await this.#tripDataApiService.destinations;
      this.#offers = await this.#tripDataApiService.offers;

      this.#eventPoints = eventPoints.map((point) => this.#adaptToClient(point));
    } catch (err) {
      this.#eventPoints = [];
    }

    this._notify(UpdateLevels.INIT);
  }

  get eventPoints() {
    return this.#eventPoints;
  }

  async updatePoint(updateLevel, updatedPoint) {
    const index = this.#eventPoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event point');
    }

    try {
      const response = await this.#tripDataApiService.updatePoint(updatedPoint);
      const updatedEventPoint = this.#adaptToClient(response);

      this.#eventPoints = [
        ...this.#eventPoints.slice(0, index),
        updatedEventPoint,
        ...this.#eventPoints.slice(index + 1)
      ];

      this._notify(updateLevel, updatedEventPoint);
    } catch(err) {
      throw new Error('Can\'t update event point ');
    }
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

  #adaptToClient(eventPoint) {
    const destination = this.#destinations.find((dest) => dest.id === eventPoint['destination']) ?? null;
    const typeOffers = this.#offers.find((typeOffer) => typeOffer.type === eventPoint['type']);

    const adaptedPoint = {
      ...eventPoint,
      basePrice: eventPoint['base_price'],
      dateFrom: eventPoint['date_from'] !== null ? new Date(eventPoint['date_from']) : eventPoint['date_from'],
      dateTo: eventPoint['date_to'] !== null ? new Date(eventPoint['date_to']) : eventPoint['date_to'],
      isFavorite: eventPoint['is_favorite'],
      destination,
      offers: typeOffers ? typeOffers.offers.map((offer) => ({...offer, checked: eventPoint['offers'].includes(offer.id)})) : []
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
