import { render } from './framework/render.js';
import FiltersView from './view/filters-view.js';
import EventsListPresenter from './presenter/events-list-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { generateFilteredEvents } from './mock/mock-filter.js';

const pageHeaderElement = document.querySelector('.page-header');
const filterElement = pageHeaderElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel(destinationsModel.destinations, offersModel.offers);

const eventsListPresenter = new EventsListPresenter(tripEventsElement, pointsModel);

const filteredEvents = generateFilteredEvents(pointsModel.eventPoints);

render(new FiltersView(filteredEvents), filterElement);
eventsListPresenter.init();
