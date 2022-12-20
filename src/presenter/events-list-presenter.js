import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/events-list-view.js';
import EditPointBoardView from '../view/edit-point-board-view.js';
import EventPointView from '../view/event-point-view.js';

export default class EventsListPresenter {
  #eventsListComponent = new TripEventsListView();

  #listContainer = null;
  #pointsModel = null;

  #eventPoints = null;
  #destinations = null;
  #offers = null;

  constructor(boardContainer, pointsModel) {
    this.#listContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventPoints = [...this.#pointsModel.eventPoints];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    render(new SortView(), this.#listContainer);
    render(this.#eventsListComponent, this.#listContainer);

    this.#eventPoints.forEach((eventPoint) => {
      const destination = this.#destinations.find((value) => value.id === eventPoint.destination);
      const typeOffers = this.#offers.find((offers) => offers.type === eventPoint.type);

      this.#renderEventPoint(eventPoint, destination, typeOffers);
    });
  }

  #renderEventPoint(eventPoint, destination, typeOffers) {
    const pointComponent = new EventPointView(eventPoint, destination, typeOffers);
    const editPointBoardComponent = new EditPointBoardView(eventPoint, destination, typeOffers);

    const openPointBoardButton = pointComponent.getChildNode('.event__rollup-btn');
    const closePointBoardButton = editPointBoardComponent.getChildNode('.event__rollup-btn');

    const pointBoardForm = editPointBoardComponent.getChildNode('form');

    const replacePointToBoard = () => {
      this.#eventsListComponent.element.replaceChild(editPointBoardComponent.element, pointComponent.element);
    };

    const replaceBoardToPoint = () => {
      this.#eventsListComponent.element.replaceChild(pointComponent.element, editPointBoardComponent.element);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceBoardToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    openPointBoardButton.addEventListener('click', () => {
      replacePointToBoard();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    closePointBoardButton.addEventListener('click', () => {
      replaceBoardToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    pointBoardForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceBoardToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#eventsListComponent.element);
  }
}
