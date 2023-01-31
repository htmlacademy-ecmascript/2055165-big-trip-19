import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListMessage } from '../constants.js';

function createEmptyListTemplate(filterType) {
  return `<p class="trip-events__msg">${EmptyListMessage[filterType]}</p>`;
}

export default class EmptyListView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createEmptyListTemplate(this.#currentFilterType);
  }
}
