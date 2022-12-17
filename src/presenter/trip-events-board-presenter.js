import { render } from '../render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsBoardView from '../view/trip-events-board-view.js';
import EditPointBoardView from '../view/edit-point-board-view.js';
import TripEventPointView from '../view/trip-event-point-view.js';

export default class TripEventsBoardPresenter {
  boardComponent = new TripEventsBoardView();

  constructor(boardContainer, pointsModel) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.eventPoints = [...this.pointsModel.getEventPoints()];
    this.destinations = [...this.pointsModel.getDestinations()];
    this.offers = [...this.pointsModel.getOffers()];

    render(new TripSortView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);

    this.eventPoints.forEach((eventPoint, index) => {
      const destination = this.destinations.find((value) => value.id === eventPoint.destination);
      const typeOffers = this.offers.find((offers) => offers.type === eventPoint.type);
      if (index === 0) {
        render(new EditPointBoardView(eventPoint, destination, typeOffers), this.boardComponent.getElement());
      } else {
        render(new TripEventPointView(eventPoint, destination, typeOffers), this.boardComponent.getElement());
      }
    });
  }
}
