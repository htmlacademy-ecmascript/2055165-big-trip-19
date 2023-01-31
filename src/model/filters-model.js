import Observable from '../framework/observable.js';
import { FilterType } from '../constants';

export default class FiltersModel extends Observable {
  #filterType = FilterType.EVERYTHING;

  get filterType() {
    return this.#filterType;
  }

  setFilter(updateLevel, filterType) {
    this.#filterType = filterType;
    this._notify(updateLevel, filterType);
  }
}
