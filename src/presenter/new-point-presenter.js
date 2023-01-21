import { ActionTypes, UpdateLevels } from '../constants.js';
import {remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 4);

export default class NewPointPresenter {
  #eventsListContainer = null;

  #editPointComponent = null;

  #pointsModel = null;

  #destinations = null;
  #offers = null;

  #handleDataChange = null;
  #handleNewPointEditorCancel = null;

  #restoreEmptyBoard = null;

  constructor(
    onDataChange,
    restoreEmptyBoard,
    onNewPointEditorCancel,
    pointsModel
  ) {
    this.#handleDataChange = onDataChange;
    this.#restoreEmptyBoard = restoreEmptyBoard;
    this.#handleNewPointEditorCancel = onNewPointEditorCancel;
    this.#pointsModel = pointsModel;
  }

  init(eventsListContainer, destinations, offers) {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#eventsListContainer = eventsListContainer;
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

  destroyComponent(isNewPointCreated = true) {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#handleNewPointEditorCancel();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    if (!isNewPointCreated && this.#pointsModel.eventPoints.length === 0) {
      this.#restoreEmptyBoard();
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditorFormSubmit = (newPoint) => {
    this.#handleDataChange(
      ActionTypes.ADD_POINT,
      UpdateLevels.MINOR,
      {...newPoint, id: nanoid(4)}
    );

    this.destroyComponent();
  };

  #handleEditorFormDelete = () => {
    this.destroyComponent(false);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroyComponent(false);
    }
  };
}
