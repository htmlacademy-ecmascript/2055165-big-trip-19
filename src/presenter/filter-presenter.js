import { remove, render, replace } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateLevel } from '../constants.js';

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
        type: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](eventPoints).length
      },
      {
        type: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](eventPoints).length
      },
      {
        type: FilterType.PRESENT,
        count: filter[FilterType.PRESENT](eventPoints).length
      },
      {
        type: FilterType.PAST,
        count: filter[FilterType.PAST](eventPoints).length
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

    this.#filtersModel.setFilter(UpdateLevel.MAJOR, filterType);
  };


}
