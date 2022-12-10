import { render } from '../render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsBoardView from '../view/trip-events-board-view.js';
import EditPointBoardView from '../view/edit-point-board-view.js';
import TripEventPointView from '../view/trip-event-point-view.js';

const TEST_POINTS_COUNT = 3;

export default class TripEventsBoardPresenter {
  tripEventsBoardComponent = new TripEventsBoardView();

  constructor(tripEventsBoardContainer) {
    this.tripEventsBoardContainer = tripEventsBoardContainer;
  }

  init() {
    render (new TripSortView(), this.tripEventsBoardContainer);
    render(this.tripEventsBoardComponent, this.tripEventsBoardContainer);
    render(new EditPointBoardView(), this.tripEventsBoardComponent.getElement());

    for (let i = 0; i < TEST_POINTS_COUNT; i++) {
      render(new TripEventPointView(), this.tripEventsBoardComponent.getElement());
    }
  }
}
