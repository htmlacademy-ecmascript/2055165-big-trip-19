import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListMessages, DEFAULT_FILTER_TYPE } from '../constants.js';

function createEmptyListTemplate(filterType) {
  return `<p class="trip-events__msg">${EmptyListMessages[filterType]}</p>`;
}

export default class EmptyListView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType = DEFAULT_FILTER_TYPE) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createEmptyListTemplate(this.#currentFilterType);
  }
}
