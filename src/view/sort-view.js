import AbstractView from '../framework/view/abstract-view.js';
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

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType = DEFAULT_SORT_TYPE) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }
}
