import { render } from './render.js';
import TimeFilterView from './view/time-filters-view.js';
import TripEventsBoardPresenter from './presenter/trip-events-board-presenter.js';

const pageHeaderElement = document.querySelector('.page-header');
const tripControlTimeFiltersElement = pageHeaderElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const tripEventsBoardPresenter = new TripEventsBoardPresenter({tripEventsBoardContainer: tripEventsElement});

render(new TimeFilterView(), tripControlTimeFiltersElement);
tripEventsBoardPresenter.init();

