import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../constants.js';

const getDisabledAttr = (filteredPoints, filterType) =>
  filteredPoints.find((element) => element.type === filterType).count === 0 && filterType !== FilterType.EVERYTHING ? 'disabled' : '';

const getCheckedAttr = (filterType, currentFilterType) => filterType === currentFilterType ? 'checked' : '';

function createFiltersTemplate(filteredPoints, currentFilterType) {
  const filterList = Object.values(FilterType).map((filterType) => {

    const disabledAttr = getDisabledAttr(filteredPoints, filterType);
    const checkedAttr = getCheckedAttr(filterType, currentFilterType);

    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filterType}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filterType}"
          ${disabledAttr}
          ${checkedAttr}
        />
        <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
      </div>`
    );
  }).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #currentFilterType = null;
  #filteredPoints = null;

  #handleFilterTypeChange = null;

  constructor(filteredPoints, currentFilterType, onFilterTypeChange) {
    super();
    this.#filteredPoints = filteredPoints;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    document.querySelector('.trip-controls__filters').addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filteredPoints, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const filterTypeElement = evt.target.closest('.trip-filters__filter');

    if (!filterTypeElement) {
      return;
    }

    const updatedFilterType = filterTypeElement.querySelector('.trip-filters__filter-input').value;
    this.#handleFilterTypeChange(updatedFilterType);
  };
}
