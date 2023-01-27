import {remove, render, replace} from '../framework/render.js';
import EventPointView from '../view/event-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { PointActionTypes, UpdateLevels } from '../constants.js';
import { areDatesEqual } from '../utils/point-event-utils.js';

const Modes = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

export default class EventPointPresenter {
  #eventsListContainer = null;

  #eventPointComponent = null;
  #editPointComponent = null;

  #eventPoint = null;
  #destinations = null;
  #offers = null;

  #viewMode = Modes.DEFAULT;

  #handleDataChange = null;
  #handleViewModeChange = null;

  constructor(eventsListContainer, onDataChange, onViewModeChange) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleViewModeChange = onViewModeChange;
  }

  init(eventPoint, destinations, offers) {

    const prevEventPointComponent = this.#eventPointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#eventPoint = eventPoint;
    this.#destinations = destinations;
    this.#offers = offers;

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
        destinations: this.#destinations,
        offers: this.#offers,
        onCloseEditorButtonClick : this.#handleCloseEditorButtonClick,
        onEditorFormSubmit : this.#handleEditorFormSubmit,
        onEditorFormDelete : this.#handleEditorFormDelete
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
      replace(this.#eventPointComponent, prevEditPointComponent);
      this.#viewMode = Modes.DEFAULT;
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
      this.#editPointComponent.reset(this.#eventPoint);
      this.#replaceEditorToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#eventPoint);
      this.#replaceEditorToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  setSaving() {
    if (this.#viewMode === Modes.EDIT) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#viewMode === Modes.EDIT) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#viewMode === Modes.DEFAULT) {
      this.#eventPointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement(
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        }
      );
    };

    this.#editPointComponent.shake(resetFormState);
  }

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

  #handleCloseEditorButtonClick = () => {
    this.#editPointComponent.reset(this.#eventPoint);
    this.#replaceEditorToPoint();
  };

  #handleEditorFormSubmit = (updatedPoint) => {
    const isMinorUpdate = !(areDatesEqual(this.#eventPoint.dateFrom, updatedPoint.dateFrom)
      && areDatesEqual(this.#eventPoint.dateTo, updatedPoint.dateTo))
      || (this.#eventPoint.basePrice !== updatedPoint.basePrice);

    this.#handleDataChange(
      PointActionTypes.UPDATE,
      isMinorUpdate ? UpdateLevels.MINOR : UpdateLevels.PATCH,
      updatedPoint
    );
  };

  #handleFavoriteButtonCLick = () => {
    this.#handleDataChange(
      PointActionTypes.UPDATE,
      UpdateLevels.PATCH,
      {...this.#eventPoint, isFavorite: !this.#eventPoint.isFavorite}
    );
  };

  #handleEditorFormDelete = (updatedPoint) => {
    this.#handleDataChange(
      PointActionTypes.DELETE,
      UpdateLevels.MINOR,
      updatedPoint
    );
  };

}
