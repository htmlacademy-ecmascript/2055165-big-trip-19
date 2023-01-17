import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { SortTypes, DEFAULT_SORT_TYPE } from '../constants.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/point-event-utils.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPointPresenter from './event-point-presenter.js';

export default class EventsListPresenter {
  #eventsListBoardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #currentSortType = DEFAULT_SORT_TYPE;

  #eventPoints = [];
  #destinations = [];
  #offers = [];

  #originalEventPoints = [];

  #sortComponent = null;

  #emptyListComponent = new EmptyListView();
  #eventsListComponent = new EventsListView();

  #eventPointPresenters = new Map();

  constructor(eventsListBoardContainer, pointsModel, destinationsModel, offersModel) {
    this.#eventsListBoardContainer = eventsListBoardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get eventPoints() {
    return this.#pointsModel.eventPoints;
  }

  init() {
    this.#originalEventPoints = [...this.#pointsModel.eventPoints];
    this.#eventPoints = [...this.#pointsModel.eventPoints];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];


    if (this.#eventPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#sortEventPoints(this.#currentSortType);
    this.#renderEventsList();
  }


  #renderSort() {
    this.#sortComponent = new SortView(this.#handleSortTypeChange, this.#currentSortType);
    render(this.#sortComponent, this.#eventsListBoardContainer);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#eventsListBoardContainer);

    this.#eventPoints.forEach((eventPoint) => this.#renderEventPoint(eventPoint));
  }

  #renderEventPoint(eventPoint) {
    const eventPointPresenter = new EventPointPresenter(this.#eventsListComponent.element, this.#handleDataChange, this.#handleViewModeChange);
    this.#eventPointPresenters.set(eventPoint.id, eventPointPresenter);

    eventPointPresenter.init(eventPoint, this.#destinations, this.#offers);
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#eventsListBoardContainer);
  }

  #clearEventsList() {
    this.#eventPointPresenters.forEach((presenter) => presenter.destroyPointComponents());
    this.#eventPointPresenters.clear();
  }

  #sortEventPoints(sortType) {
    switch(sortType) {
      case SortTypes.DAY:
        this.#eventPoints.sort(sortByDay);
        break;
      case SortTypes.PRICE:
        this.#eventPoints.sort(sortByPrice);
        break;
      case SortTypes.TIME:
        this.#eventPoints.sort(sortByTime);
        break;
      default:
        this.#eventPoints = [...this.#originalEventPoints];
    }
  }

  #handleViewModeChange = () => this.#eventPointPresenters.forEach((presenter) => presenter.resetView());

  #handleDataChange = (updatedEventPoint) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedEventPoint);
    this.#originalEventPoints = updateItem(this.#originalEventPoints, updatedEventPoint);

    this.#eventPointPresenters.get(updatedEventPoint.id).init(updatedEventPoint, this.#destinations, this.#offers);
  };

  #handleSortTypeChange = (sortType) => {
    this.#sortEventPoints(sortType);
    this.#clearEventsList();
    this.#renderEventsList();
  };
}
