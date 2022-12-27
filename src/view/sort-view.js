import AbstractView from '../framework/view/abstract-view.js';
import { SortTypes, DISABLED_SORT_TYPES } from '../constants.js';

const getDisabledAttr = (sortType) => DISABLED_SORT_TYPES.includes(sortType) ? 'disabled' : '' ;
const getCheckedAttr = (sortType, currentSortType) => sortType === currentSortType ? 'checked' : '';

function createTripSortTemplate(currentSortType) {

  const sortTypesList = Object.values(SortTypes).map((sortType) => {

    const disabledAttr = getDisabledAttr(sortType);
    const checkedAttr = getCheckedAttr(sortType, currentSortType);

    return `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${sortType}" data-sort-type="${sortType}" ${disabledAttr} ${checkedAttr}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType === SortTypes.OFFER ? 'offers' : sortType}</label>
    </div>`;
  }).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTypesList}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #currentSortType = null;

  #handleSortTypeChange = null;

  constructor(onSortTypeChange, currentSortType) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }

  getChildNode(selector) {
    return this.element.querySelector(selector);
  }

  #sortTypeChangeHandler = (evt) => {
    const filterELement = evt.target.closest('.trip-sort__item').querySelector('.trip-sort__input');
    if (filterELement) {
      evt.preventDefault();
      this.#handleSortTypeChange(filterELement.dataset.sortType);
    }
  };
}
