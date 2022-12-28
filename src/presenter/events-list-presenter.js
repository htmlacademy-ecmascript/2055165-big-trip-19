import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPointPresenter from './event-point-presenter.js';

export default class EventsListPresenter {
  #eventsListBoardContainer = null;
  #pointsModel = null;

  #eventPoints = [];
  #destinations = [];
  #offers = [];

  #sortComponent = new SortView();
  #emptyListComponent = new EmptyListView();
  #eventsListComponent = new EventsListView();

  #eventPointPresenters = new Map();

  constructor(eventsListBoardContainer, pointsModel) {
    this.#eventsListBoardContainer = eventsListBoardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventPoints = [...this.#pointsModel.eventPoints];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    if (this.#eventPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }


  #renderSort() {
    render(this.#sortComponent, this.#eventsListBoardContainer);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#eventsListBoardContainer);

    this.#eventPoints.forEach((eventPoint) => {
      const destination = this.#destinations.find((value) => value.id === eventPoint.destination);
      const typeOffers = this.#offers.find((offers) => offers.type === eventPoint.type);

      this.#renderEventPoint(eventPoint, destination, typeOffers);
    });
  }

  #renderEventPoint(eventPoint, destination, typeOffers) {
    const eventPointPresenter = new EventPointPresenter(this.#eventsListComponent.element, this.#handleDataChange, this.#handleViewModeChange);
    this.#eventPointPresenters.set(eventPoint.id, eventPointPresenter);

    eventPointPresenter.init(eventPoint, destination, typeOffers);
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#eventsListBoardContainer);
  }

  #handleViewModeChange = () => this.#eventPointPresenters.forEach((presenter) => presenter.resetView());

  #handleDataChange = (updatedEventPoint) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedEventPoint);

    const destination = this.#destinations.find((value) => value.id === updatedEventPoint.destination);
    const typeOffers = this.#offers.find((offers) => offers.type === updatedEventPoint.type);

    this.#eventPointPresenters.get(updatedEventPoint.id).init(updatedEventPoint, destination, typeOffers);
  };
}
