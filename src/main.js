import EventsListPresenter from './presenter/events-list-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from './model/filters-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';

const pageHeaderMainElement = document.querySelector('.page-header .trip-main');
const filterElement = pageHeaderMainElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel(destinationsModel.destinations, offersModel.offers);

const filtersModel = new FiltersModel();

const filterPresenter = new FilterPresenter(filterElement, filtersModel, pointsModel);
const eventsListPresenter = new EventsListPresenter(
  {
    eventsListBoardContainer: tripEventsElement,
    pointsModel,
    destinationsModel,
    offersModel,
    filtersModel,
    onNewPointEditorCancel: handleEditorFormCancel
  }
);

const newPointButtonComponent = new NewPointButtonView(handleNewPointButtonClick);

function handleNewPointButtonClick () {
  eventsListPresenter.createNewPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleEditorFormCancel () {
  newPointButtonComponent.element.disabled = false;
}

filterPresenter.init();
render(newPointButtonComponent, pageHeaderMainElement);
eventsListPresenter.init();
