import { ActionTypes, UpdateLevels } from '../constants.js';
import {remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';

export default class NewPointPresenter {
  #eventsListContainer = null;

  #editPointComponent = null;

  #destinations = null;
  #offers = null;

  #handleDataChange = null;
  #handleDestroyNewPoint = null;

  constructor(eventsListContainer, onDataChange, onDeleteNewPoint) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroyNewPoint = onDeleteNewPoint;
  }

  init(destinations, offers) {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#destinations = destinations;
    this.#offers = offers;

    this.#editPointComponent = new EditPointView(
      {
        destinations: this.#destinations,
        offers: this.#offers,
        onEditorFormSubmit: this.#handleEditorFormSubmit,
        onEditorFormDelete: this.#handleEditorFormDelete
      }
    );

    render(this.#editPointComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroyComponent() {
    if (this.editPointComponent === null) {
      return;
    }

    this.#handleDestroyNewPoint();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditorFormSubmit = (newPoint) => {
    this.#handleDataChange(
      ActionTypes.ADD_POINT,
      UpdateLevels.MINOR,
      {id: 444, ...newPoint}
    );

    this.destroyComponent();
  };

  #handleEditorFormDelete = () => this.destroyComponent();

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroyComponent();
    }
  };
}
