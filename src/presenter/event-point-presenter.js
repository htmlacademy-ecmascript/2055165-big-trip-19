import {remove, render, replace} from '../framework/render.js';
import EventPointView from '../view/event-point-view.js';
import EditPointBoardView from '../view/edit-point-board-view.js';

const Modes = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPointPresenter {
  #eventsListContainer = null;

  #eventPointComponent = null;
  #editPointBoardComponent = null;

  #eventPoint = null;
  #destination = null;
  #typeOffers = null;

  #viewMode = Modes.DEFAULT;

  #handleDataChange = null;
  #handleViewModeChange = null;

  constructor(eventsListContainer, onDataChange, onViewModeChange) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleViewModeChange = onViewModeChange;
  }

  init(eventPoint, destination, typeOffers) {

    const prevEventPointComponent = this.#eventPointComponent;
    const prevEditPointBoardComponent = this.#editPointBoardComponent;

    this.#eventPoint = eventPoint;
    this.#destination = destination;
    this.#typeOffers = typeOffers;

    this.#eventPointComponent = new EventPointView(
      {
        eventPoint: this.#eventPoint,
        destination: this.#destination,
        typeOffers: this.#typeOffers,
        onOpenPointBoardButtonClick: this.#handleOpenPointBoardButtonClick,
        onFavoriteButtonClick: this.#handleFavoriteButtonCLick
      }
    );

    this.#editPointBoardComponent = new EditPointBoardView(
      {
        eventPoint: this.#eventPoint,
        destination: this.#destination,
        typeOffers: this.#typeOffers,
        onClosePointBoardButtonClick : this.#handleClosePointBoardButtonClick,
        onPointBoardFormSubmit : this.#handlePointBoardFormSubmit
      }
    );

    if (prevEventPointComponent === null || prevEditPointBoardComponent === null ) {
      render(this.#eventPointComponent, this.#eventsListContainer);
      return;
    }

    if (this.#viewMode === Modes.DEFAULT) {
      replace(this.#eventPointComponent, prevEventPointComponent);
    }

    if (this.#viewMode === Modes.EDITING) {
      replace(this.#editPointBoardComponent, prevEditPointBoardComponent);
    }

    remove(prevEventPointComponent);
    remove(prevEditPointBoardComponent);
  }

  destroyPointComponents() {
    remove(this.#eventPointComponent);
    remove(this.#editPointBoardComponent);
  }

  resetView() {
    if (this.#viewMode !== Modes.DEFAULT) {
      this.#replaceBoardToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceBoardToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToBoard () {
    replace(this.#editPointBoardComponent, this.#eventPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleViewModeChange();
    this.#viewMode = Modes.EDITING;
  }

  #replaceBoardToPoint () {
    replace(this.#eventPointComponent, this.#editPointBoardComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#viewMode = Modes.DEFAULT;
  }

  #handleOpenPointBoardButtonClick = () => this.#replacePointToBoard();

  #handleClosePointBoardButtonClick = () => this.#replaceBoardToPoint();

  #handlePointBoardFormSubmit = (eventPoint) => {
    this.#handleDataChange(eventPoint);
    this.#replaceBoardToPoint();
  };

  #handleFavoriteButtonCLick = () => this.#handleDataChange({...this.#eventPoint, isFavorite: !this.#eventPoint.isFavorite});

}
