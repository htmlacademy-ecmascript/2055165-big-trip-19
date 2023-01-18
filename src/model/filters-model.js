import Observable from '../framework/observable.js';
import { FilterTypes } from '../constants';

export default class FiltersModel extends Observable {
  #filterType = FilterTypes.EVERYTHING;

  get filterType() {
    return this.#filterType;
  }

  setFilter(updateLevel, filterType) {
    this.#filterType = filterType;
    this._notify(updateLevel, filterType);
  }
}
