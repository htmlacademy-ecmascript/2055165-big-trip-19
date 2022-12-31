import {remove, render, replace} from '../framework/render.js';
import EventPointView from '../view/event-point-view.js';
import EditPointView from '../view/edit-point-view.js';

const Modes = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

export default class EventPointPresenter {
  #eventsListContainer = null;

  #eventPointComponent = null;
  #editPointComponent = null;

  #eventPoint = null;

  #viewMode = Modes.DEFAULT;

  #handleDataChange = null;
  #handleViewModeChange = null;

  constructor(eventsListContainer, onDataChange, onViewModeChange) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleViewModeChange = onViewModeChange;
  }

  init(eventPoint) {

    const prevEventPointComponent = this.#eventPointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#eventPoint = eventPoint;

    this.#eventPointComponent = new EventPointView(
      {
        eventPoint: this.#eventPoint,
        onOpenEditorButtonClick: this.#handleOpenEditorButtonClick,
        onFavoriteButtonClick: this.#handleFavoriteButtonCLick
      }
    );

    this.#editPointComponent = new EditPointView(
      {
        eventPoint: this.#eventPoint,
        onCloseEditorButtonClick : this.#handleCloseEditorButtonClick,
        onEditorFormSubmit : this.#handleEditorFormSubmit
      }
    );

    if (prevEventPointComponent === null || prevEditPointComponent === null ) {
      render(this.#eventPointComponent, this.#eventsListContainer);
      return;
    }

    if (this.#viewMode === Modes.DEFAULT) {
      replace(this.#eventPointComponent, prevEventPointComponent);
    }

    if (this.#viewMode === Modes.EDIT) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevEventPointComponent);
    remove(prevEditPointComponent);
  }

  destroyPointComponents() {
    remove(this.#eventPointComponent);
    remove(this.#editPointComponent);
  }

  resetView() {
    if (this.#viewMode !== Modes.DEFAULT) {
      this.#replaceEditorToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditorToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToEditor () {
    replace(this.#editPointComponent, this.#eventPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleViewModeChange();
    this.#viewMode = Modes.EDIT;
  }

  #replaceEditorToPoint () {
    replace(this.#eventPointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#viewMode = Modes.DEFAULT;
  }

  #handleOpenEditorButtonClick = () => this.#replacePointToEditor();

  #handleCloseEditorButtonClick = () => this.#replaceEditorToPoint();

  #handleEditorFormSubmit = (eventPoint) => {
    this.#handleDataChange(eventPoint);
    this.#replaceEditorToPoint();
  };

  #handleFavoriteButtonCLick = () => this.#handleDataChange({...this.#eventPoint, isFavorite: !this.#eventPoint.isFavorite});

}
