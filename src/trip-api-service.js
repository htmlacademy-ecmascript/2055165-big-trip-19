import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class TripApiService extends ApiService {

  get eventPoints() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  async updatePoint(eventPoint) {
    const response = await this._load(
      {
        url: `points/${eventPoint.id}`,
        method: Method.PUT,
        body: JSON.stringify(this.#adaptToServer(eventPoint)),
        headers: new Headers({ 'Content-Type': 'application/json' })
      }
    );
    return await ApiService.parseResponse(response);
  }

  async deletePoint(eventPoint) {
    const response = await this._load(
      {
        url: `points/${eventPoint.id}`,
        method: Method.DELETE,
      }
    );
    return response;
  }

  async addNewPoint(eventPoint) {
    const response = await this._load(
      {
        url: 'points',
        method: Method.POST,
        body: JSON.stringify(this.#adaptToServer(eventPoint)),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }
    );
    return await ApiService.parseResponse(response);
  }

  #adaptToServer(eventPoint) {
    const adaptedPoint = {
      ...eventPoint,
      'base_price': +eventPoint.basePrice,
      'date_from': eventPoint.dateFrom instanceof Date ? eventPoint.dateFrom.toISOString() : null,
      'date_to': eventPoint.dateTo instanceof Date ? eventPoint.dateTo.toISOString() : null,
      'is_favorite': eventPoint.isFavorite,
      'destination': eventPoint.destination.id,
      'offers': eventPoint.offers.filter((offer) => offer.checked).map((offer) => offer.id)
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
