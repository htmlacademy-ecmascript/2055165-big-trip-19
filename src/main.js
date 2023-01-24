import EventsListPresenter from './presenter/events-list-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from './model/filters-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';
import TripDataApiService from './trip-data-api-service.js';

const AUTH_TOKEN = 'Basic kTy9gIdsz2317rD';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip/';

const tripDataApiService = new TripDataApiService(END_POINT, AUTH_TOKEN);

const pageHeaderMainElement = document.querySelector('.trip-main');
const filterElement = pageHeaderMainElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const destinationsModel = new DestinationsModel(tripDataApiService);
const offersModel = new OffersModel(tripDataApiService);
const pointsModel = new PointsModel(tripDataApiService);

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

destinationsModel.init();
offersModel.init();
pointsModel.init().finally(() => render(newPointButtonComponent, pageHeaderMainElement));

filterPresenter.init();
eventsListPresenter.init();

