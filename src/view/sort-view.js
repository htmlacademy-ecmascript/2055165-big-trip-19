import { createElement } from '../render.js';

import { SORT_TYPES } from '../constants.js';

function createTripSortTemplate() {

  const sortTypesList = SORT_TYPES.map((sortType, index) => {
    let lastProp = '';
    if (index === 0) {
      lastProp = 'checked';
    } else if (index === 2 || index === 4) {
      lastProp = 'disabled';
    }

    return `<div class="trip-sort__item  trip-sort__item--${sortType}">
              <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}"${lastProp}>
              <label class="trip-sort__btn" for="sort-${sortType}">${sortType}${index === 4 ? 's' : ''}</label>
            </div>`;
  }).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTypesList}
    </form>`
  );
}

export default class SortView {
  #element = null;

  get template() {
    return createTripSortTemplate();
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
