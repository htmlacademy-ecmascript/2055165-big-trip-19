import { render } from './render.js';
import FiltersView from './view/filters-view.js';
import TripEventsBoardPresenter from './presenter/trip-events-board-presenter.js';
import PointsModel from './model/points-model.js';

const pageHeaderElement = document.querySelector('.page-header');
const filterElement = pageHeaderElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripEventsBoardPresenter = new TripEventsBoardPresenter(tripEventsElement, pointsModel);

render(new FiltersView(), filterElement);
tripEventsBoardPresenter.init();
