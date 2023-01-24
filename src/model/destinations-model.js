export default class DestinationsModel {
  #tripDataApiService = null;
  #destinations = [];

  constructor(tripDataApiService) {
    this.#tripDataApiService = tripDataApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#tripDataApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }

  get destinations() {
    return this.#destinations;
  }
}
