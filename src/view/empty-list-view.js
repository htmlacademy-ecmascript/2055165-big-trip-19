import { createElement } from '../render.js';
import { EMPTY_LIST_MESSAGES } from '../constants.js';

function createEmptyListTemplate(filterType) {
  return `<p class="trip-events__msg">${EMPTY_LIST_MESSAGES[filterType]}</p>`;
}

export default class EmptyListView {
  #element = null;
  #filterType = null;

  constructor(filterType) {
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
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
