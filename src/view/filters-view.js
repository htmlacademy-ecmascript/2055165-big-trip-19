import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypes, DEFAULT_FILTER_TYPE } from '../constants.js';


function createFiltersTemplate(currentFilterType) {
  const filterList = Object.values(FilterTypes).map((filterType) =>
    `<div class="trip-filters__filter">
      <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
      value="${filterType}"${filterType === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
    </div>`).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType = DEFAULT_FILTER_TYPE){
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#currentFilterType);
  }
}
