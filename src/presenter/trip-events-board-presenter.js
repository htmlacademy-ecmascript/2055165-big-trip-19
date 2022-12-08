import { render } from '../render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsBoardView from '../view/trip-events-board-view.js';
import EditPointBoardView from '../view/edit-point-view.js';
import TripEventPointView from '../view/trip-event-point-view.js';

export default class TripEventsBoardPresenter {
  tripEventsBoardComponent = new TripEventsBoardView();

  constructor({tripEventsBoardContainer}) {
    this.tripEventsBoardContainer = tripEventsBoardContainer;
  }

  init() {
    render (new TripSortView(), this.tripEventsBoardContainer);
    render(this.tripEventsBoardComponent, this.tripEventsBoardContainer);
    render(new EditPointBoardView(), this.tripEventsBoardComponent.getElement());
    render(new TripEventPointView(), this.tripEventsBoardComponent.getElement());
  }

}
