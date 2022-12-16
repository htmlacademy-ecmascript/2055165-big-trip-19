import { render } from '../render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsBoardView from '../view/trip-events-board-view.js';
import EditPointBoardView from '../view/edit-point-board-view.js';
import TripEventPointView from '../view/trip-event-point-view.js';

export default class TripEventsBoardPresenter {
  boardComponent = new TripEventsBoardView();

  constructor(boardContainer, eventsModel) {
    this.boardContainer = boardContainer;
    this.eventsModel = eventsModel;
  }

  init() {
    this.eventPoints = [...this.eventsModel.getEventPoints()];
    this.destinations = [...this.eventsModel.getDestinations()];
    this.offers = [...this.eventsModel.getOffers()];

    render(new TripSortView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(new EditPointBoardView(), this.boardComponent.getElement());

    for (let i = 0; i < this.eventPoints.length; i++) {
      const eventPoint = this.eventPoints[i];
      const destination = this.destinations.find((value) => value.id === eventPoint.destination);
      const typeOffers = this.offers.find((offers) => offers.type === eventPoint.type);
      render(new TripEventPointView(eventPoint, destination, typeOffers), this.boardComponent.getElement());
    }
  }
}
