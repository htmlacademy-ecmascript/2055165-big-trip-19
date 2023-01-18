import { remove, render } from '../framework/render.js';
import { SortTypes, DEFAULT_SORT_TYPE, ActionTypes, UpdateLevels, FilterTypes } from '../constants.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/point-event-utils.js';
import { filter } from '../utils/filter.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPointPresenter from './event-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class EventsListPresenter {
  #eventsListBoardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filtersModel = null;

  #currentSortType = DEFAULT_SORT_TYPE;

  #destinations = [];
  #offers = [];

  #sortComponent = null;
  #emptyListComponent = null;

  #eventsListComponent = new EventsListView();

  #newPointPresenter = null;
  #eventPointPresenters = new Map();

  constructor(
    {
      eventsListBoardContainer,
      pointsModel,
      destinationsModel,
      offersModel,
      filtersModel,
      onNewPointDelete
    }
  ) {
    this.#eventsListBoardContainer = eventsListBoardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new NewPointPresenter(
      this.#eventsListComponent.element,
      this.#handleViewAction,
      onNewPointDelete
    );

    this.#pointsModel.addObserver(this.#handleModelUpdate);
    this.#filtersModel.addObserver(this.#handleModelUpdate);
  }

  get filteredPoints() {
    const filterType = this.#filtersModel.filterType;
    const filteredPoints = filter[filterType](this.#pointsModel.eventPoints);

    switch(this.#currentSortType) {
      case SortTypes.DAY:
        return filteredPoints.sort(sortByDay);
      case SortTypes.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortTypes.TIME:
        return filteredPoints.sort(sortByTime);
    }
    return filteredPoints;
  }

  init() {
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#renderBoard();
  }

  createNewPoint() {
    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filtersModel.setFilter(UpdateLevels.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init(this.#destinations, this.#offers);
  }

  #renderBoard() {
    if (this.#pointsModel.eventPoints.length === 0) {
      this.#renderEmptyList(FilterTypes.EVERYTHING);
      return;
    }

    if (this.filteredPoints.length === 0) {
      this.#renderEmptyList(this.#filtersModel.filterType);
      return;
    }

    this.#renderSortComponent();
    this.#renderEventsList();
  }

  #renderEmptyList(filterType) {
    this.#emptyListComponent = new EmptyListView(filterType);
    render(this.#emptyListComponent, this.#eventsListBoardContainer);
  }

  #renderSortComponent() {
    this.#sortComponent = new SortView(this.#currentSortType, this.#handleSortTypeChange);
    render(this.#sortComponent, this.#eventsListBoardContainer);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#eventsListBoardContainer);

    this.filteredPoints.forEach((eventPoint) => this.#renderEventPoint(eventPoint));
  }

  #renderEventPoint(eventPoint) {
    const eventPointPresenter = new EventPointPresenter(this.#eventsListComponent.element, this.#handleViewAction, this.#handleViewModeChange);
    this.#eventPointPresenters.set(eventPoint.id, eventPointPresenter);

    eventPointPresenter.init(eventPoint, this.#destinations, this.#offers);
  }

  #clearBoard(resetSortType = false) {
    this.#newPointPresenter.destroyComponent();
    this.#eventPointPresenters.forEach((presenter) => presenter.destroyPointComponents());
    this.#eventPointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #handleViewModeChange = () => {
    this.#newPointPresenter.destroyComponent();
    this.#eventPointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateLevel, updatedPoint) => {
    switch (actionType) {
      case ActionTypes.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateLevel, updatedPoint);
        break;
      case ActionTypes.ADD_POINT:
        this.#pointsModel.addNewPoint(updateLevel, updatedPoint);
        break;
      case ActionTypes.DELETE_POINT:
        this.#pointsModel.deletePoint(updateLevel, updatedPoint);
        break;
    }
  };

  #handleModelUpdate = (updateLevel, updatedPoint) => {
    switch (updateLevel) {
      case UpdateLevels.PATCH:
        this.#eventPointPresenters.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offers);
        break;
      case UpdateLevels.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateLevels.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };
}
