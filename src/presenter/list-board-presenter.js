import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPointPresenter from './event-point-presenter.js';

export default class ListBoardPresenter {
  //section class='trip-events'
  #listBoardContainer = null;
  #pointsModel = null;

  #eventPoints = [];
  #destinations = [];
  #offers = [];

  #sortComponent = new SortView();
  #emptyListComponent = new EmptyListView();
  //'<ul class="trip-events__list"></ul>'
  #eventsListComponent = new EventsListView();


  constructor(listBoardContainer, pointsModel) {
    this.#listBoardContainer = listBoardContainer;
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

  #renderEventPoint(eventPoint, destination, typeOffers) {

    const eventPointPresenter = new EventPointPresenter(this.#eventsListComponent.element);

    eventPointPresenter.init(eventPoint, destination, typeOffers);
  }

  #renderSort() {
    render(this.#sortComponent, this.#listBoardContainer);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#listBoardContainer);

    this.#eventPoints.forEach((eventPoint) => {
      const destination = this.#destinations.find((value) => value.id === eventPoint.destination);
      const typeOffers = this.#offers.find((offers) => offers.type === eventPoint.type);

      this.#renderEventPoint(eventPoint, destination, typeOffers);
    });
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#listBoardContainer);
  }
}
