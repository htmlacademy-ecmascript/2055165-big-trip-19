import {remove, render, replace} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { filter } from '../utils/filter.js';
import { FilterTypes, UpdateLevels } from '../constants.js';

export default class FilterPresenter {
  #filterContainer = null;

  #filtersModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filtersModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#filtersModel.addObserver(this.#handleModelUpdate);
    this.#pointsModel.addObserver(this.#handleModelUpdate);
  }

  get filteredPoints() {
    const eventPoints = this.#pointsModel.eventPoints;

    return [
      {
        type: FilterTypes.EVERYTHING,
        count: filter[FilterTypes.EVERYTHING](eventPoints).length
      },
      {
        type: FilterTypes.FUTURE,
        count: filter[FilterTypes.FUTURE](eventPoints).length
      },
      {
        type: FilterTypes.PRESENT,
        count: filter[FilterTypes.PRESENT](eventPoints).length
      },
      {
        type: FilterTypes.PAST,
        count: filter[FilterTypes.PAST](eventPoints).length
      }
    ];
  }


  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(
      this.filteredPoints,
      this.#filtersModel.filterType,
      this.#handleFilterTypeChange
    );

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelUpdate = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filterType === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateLevels.MAJOR, filterType);
  };


}
