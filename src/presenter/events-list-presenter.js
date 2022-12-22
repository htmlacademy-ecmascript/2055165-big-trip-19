import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EditPointBoardView from '../view/edit-point-board-view.js';
import EventPointView from '../view/event-point-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class EventsListPresenter {
  #eventsListComponent = new EventsListView();

  #listContainer = null;
  #pointsModel = null;

  #eventPoints = null;
  #destinations = null;
  #offers = null;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventPoints = [...this.#pointsModel.eventPoints];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    if (this.#eventPoints.length === 0) {
      render(new EmptyListView(), this.#listContainer);
      return;
    }

    render(new SortView(), this.#listContainer);
    render(this.#eventsListComponent, this.#listContainer);

    this.#eventPoints.forEach((eventPoint) => {
      const destination = this.#destinations.find((value) => value.id === eventPoint.destination);
      const typeOffers = this.#offers.find((offers) => offers.type === eventPoint.type);

      this.#renderEventPoint(eventPoint, destination, typeOffers);
    });
  }

  #renderEventPoint(eventPoint, destination, typeOffers) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceBoardToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new EventPointView({
      eventPoint,
      destination,
      typeOffers,
      onOpenPointBoardButtonClick : () => {
        replacePointToBoard.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointBoardComponent = new EditPointBoardView({
      eventPoint,
      destination,
      typeOffers,
      onClosePointBoardButtonClick : () => {
        replaceBoardToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onPointBoardFormSubmit : () => {
        replaceBoardToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToBoard () {
      this.#eventsListComponent.element.replaceChild(editPointBoardComponent.element, pointComponent.element);
    }

    function replaceBoardToPoint () {
      this.#eventsListComponent.element.replaceChild(pointComponent.element, editPointBoardComponent.element);
    }

    render(pointComponent, this.#eventsListComponent.element);
  }
}
