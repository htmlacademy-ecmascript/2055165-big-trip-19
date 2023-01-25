import EventsListPresenter from './presenter/events-list-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';
import TripApiService from './trip-api-service.js';

const AUTH_TOKEN = 'Basic kTy9gIdsz2317rD';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip/';

const tripApiService = new TripApiService(END_POINT, AUTH_TOKEN);

const pageHeaderMainElement = document.querySelector('.trip-main');
const filterElement = pageHeaderMainElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel(tripApiService);
const filtersModel = new FiltersModel();

const filterPresenter = new FilterPresenter(filterElement, filtersModel, pointsModel);
const eventsListPresenter = new EventsListPresenter(
  {
    eventsListBoardContainer: tripEventsElement,
    pointsModel,
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

pointsModel.init().finally(() => render(newPointButtonComponent, pageHeaderMainElement));

filterPresenter.init();
eventsListPresenter.init();

