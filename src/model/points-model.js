import Observable from '../framework/observable.js';
import { UpdateLevels } from '../constants.js';

export default class PointsModel extends Observable {
  #tripApiService = null;

  #destinations = [];
  #offers = [];
  #eventPoints = [];

  constructor(tripApiService) {
    super();
    this.#tripApiService = tripApiService;
  }

  async init() {
    try {
      const eventPoints = await this.#tripApiService.eventPoints;
      this.#destinations = await this.#tripApiService.destinations;
      this.#offers = await this.#tripApiService.offers;

      this.#eventPoints = eventPoints.map((point) => this.#adaptToClient(point));
    } catch (err) {
      this.#eventPoints = [];
    }

    this._notify(UpdateLevels.INIT);
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

  async updatePoint(updateLevel, updatedPoint) {
    const index = this.#eventPoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event point');
    }

    try {
      const response = await this.#tripApiService.updatePoint(updatedPoint);
      const updatedEventPoint = this.#adaptToClient(response);

      this.#eventPoints = [
        ...this.#eventPoints.slice(0, index),
        updatedEventPoint,
        ...this.#eventPoints.slice(index + 1)
      ];

      this._notify(updateLevel, updatedEventPoint);
    } catch(err) {
      throw new Error('Can\'t update event point');
    }
  }

  async addNewPoint(updateLevel, updatedPoint) {
    try {
      const response = await this.#tripApiService.addNewPoint(updatedPoint);
      const newEventPoint = this.#adaptToClient(response);

      this.#eventPoints = [
        newEventPoint,
        ...this.#eventPoints
      ];

      this._notify(updateLevel, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t add new event point');
    }
  }

  async deletePoint(updateLevel, updatedPoint) {
    const index = this.#eventPoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event point');
    }

    try {
      await this.#tripApiService.deletePoint(updatedPoint);

      this.#eventPoints = [
        ...this.#eventPoints.slice(0, index),
        ...this.#eventPoints.slice(index + 1)
      ];

      this._notify(updateLevel, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t delete event point');
    }
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
