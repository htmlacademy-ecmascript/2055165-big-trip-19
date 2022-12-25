import {render, replace} from '../framework/render.js';
import EventPointView from '../view/event-point-view.js';
import EditPointBoardView from '../view/edit-point-board-view.js';

export default class EventPointPresenter {
  #eventsListContainer = null;

  #eventPointComponent = null;
  #editPointBoardComponent = null;

  #eventPoint = null;
  #destination = null;
  #typeOffers = null;

  constructor(eventsListContainer) {
    this.#eventsListContainer = eventsListContainer;
  }

  init(eventPoint, destination, typeOffers) {
    this.#eventPoint = eventPoint;
    this.#destination = destination;
    this.#typeOffers = typeOffers;

    this.#eventPointComponent = new EventPointView(
      {
        eventPoint: this.#eventPoint,
        destination: this.#destination,
        typeOffers: this.#typeOffers,
        onOpenPointBoardButtonClick: this.#handleOpenPointBoardButtonClick,
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

    render(this.#eventPointComponent, this.#eventsListContainer);
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
  }

  #replaceBoardToPoint () {
    replace(this.#eventPointComponent, this.#editPointBoardComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleOpenPointBoardButtonClick = () => this.#replacePointToBoard();
  #handleClosePointBoardButtonClick = () => this.#replaceBoardToPoint();
  #handlePointBoardFormSubmit = () => this.#replaceBoardToPoint();
}
