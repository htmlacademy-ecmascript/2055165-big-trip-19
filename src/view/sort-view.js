import { createElement } from '../render.js';
import { SortTypes, DEFAULT_SORT_TYPE } from '../constants.js';

function createTripSortTemplate(currentSortType) {

  const sortTypesList = Object.values(SortTypes).map((sortType) =>
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${sortType}" ${sortType === currentSortType ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType === SortTypes.OFFER ? 'offers' : sortType}</label>
    </div>`
  ).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTypesList}
    </form>`
  );
}

export default class SortView {
  #element = null;
  #currentSortType = null;

  constructor(currentSortType = DEFAULT_SORT_TYPE) {
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
