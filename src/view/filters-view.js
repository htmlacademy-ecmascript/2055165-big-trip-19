import { createElement } from '../render.js';
import { FILTER_TYPES } from '../constants.js';

function createFiltersTemplate() {
  const filterList = FILTER_TYPES.map((filter) =>
    `<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}"${filter === 'everything' ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView {
  #element = null;

  get template() {
    return createFiltersTemplate();
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
