export default class OffersModel {
  #tripDataApiService = null;
  #offers = [];

  constructor(tripDataApiService) {
    this.#tripDataApiService = tripDataApiService;
  }

  async init() {
    try {
      this.#offers = await this.#tripDataApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
  }

  get offers() {
    return this.#offers;
  }
}
