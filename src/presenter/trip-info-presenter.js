import { remove, render, RenderPosition } from '../framework/render.js';
import { sortByDay } from '../utils/point-event-utils.js';
import { UpdateLevels } from '../constants.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoBoardContainer = null;

  #pointsModel = null;
  #tripInfoComponent = null;

  constructor(tripInfoBoardContainer, pointsModel) {
    this.#tripInfoBoardContainer = tripInfoBoardContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelUpdate);
  }

  init() {
    this.#renderTripInfo();
  }

  #handleModelUpdate = (updateLevel) => {
    switch (updateLevel) {
      case UpdateLevels.PATCH:
      case UpdateLevels.MINOR:
      case UpdateLevels.MAJOR:
        this.#clearTripInfo();
        this.#renderTripInfo();
        break;
    }
  };

  #renderTripInfo () {
    if (this.#pointsModel.eventPoints.length === 0) {
      return;
    }

    const tripInfo = this.#getTripInfo(this.#pointsModel.eventPoints);
    this.#tripInfoComponent = new TripInfoView(tripInfo);
    render(this.#tripInfoComponent, this.#tripInfoBoardContainer, RenderPosition.AFTERBEGIN);
  }

  #clearTripInfo() {
    remove(this.#tripInfoComponent);
    this.#tripInfoComponent = null;
  }

  #getTripInfo(eventPoints) {
    const sortedPoints = [...eventPoints].sort(sortByDay);

    const startTripDate = sortedPoints[0].dateFrom;
    const endTripDate = sortedPoints[sortedPoints.length - 1].dateTo;

    const citiesList = sortedPoints.map(({destination}) => destination.name);

    let totalPrice = 0;

    sortedPoints.forEach(({basePrice, offers}) => {
      totalPrice += +basePrice;
      if (offers.length > 0) {
        offers.forEach(({price, checked}) => {
          if (checked) {
            totalPrice += +price;
          }
        });
      }
    });

    return {
      startTripDate,
      endTripDate,
      citiesList,
      totalPrice
    };
  }
}
