import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDateTime } from '../utils/point-event-utils.js';
import { EventTypes, DEFAULT_EVENT_TYPE } from '../constants.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/themes/material_blue.css';

const DATETIME_FORMAT = 'DD/MM/YY HH:mm';

const NEW_EVENT_POINT = {
  basePrice: '',
  dateFrom: new Date(new Date().setHours(0, 0)),
  dateTo: new Date(new Date().setHours(23, 59)),
  destination: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_EVENT_TYPE,
};

function createEventTypesListTemplate(currentType) {
  const typesList = Object.values(EventTypes).map((eventType) =>
    `<div class="event__type-item">
      <input
        id="event-type-${eventType}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${eventType}"
        ${eventType === currentType ? 'checked' : ''}
      />
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>`
  ).join('');

  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${typesList};
      </fieldset>
    </div>`
  );
}

function createDestinationsListTemplate(destinations) {
  return destinations.map(({name}) =>
    `<option value="${name}"></option>`
  ).join('');
}

function createTypeOffersListTemplate(typeOffers, isDisabled) {
  if (typeOffers.length === 0) {
    return '';
  }

  const offersList = typeOffers.map(({id, title, price, checked}) =>
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${id}" data-offer-id="${id}"
        type="checkbox" name="event-offer-${id}"
        ${checked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      />
      <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('');

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersList}
      </div>
    </section>`
  );
}

function createEventDescriptionTemplate(destination) {
  const {description, pictures} = destination;
  if (!description && (!pictures || pictures.length === 0)) {
    return '';
  }

  const picturesContainer = pictures.length > 0 ? `<div class="event__photos-container">
                                          <div class="event__photos-tape">
                                            ${pictures.map(({src, description: picDescription}) => `<img class="event__photo" src="${src}" alt="${picDescription}">`).join('')}
                                          </div>
                                        </div>` : '';

  const descriptionContainer = description ? `<p class="event__destination-description">${description}</p>` : '';

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${descriptionContainer}
            ${picturesContainer}
          </section>`;
}

function createEventDetailsTemplate(offers, destination, isDisabled) {
  if (!destination) {
    return '';
  }

  return `<section class="event__details">
          ${createTypeOffersListTemplate(offers, isDisabled)}
          ${createEventDescriptionTemplate(destination)}
          </section>`;
}

function createCloseEditorButtonTemplate(isNewEventPoint, isDisabled){
  return isNewEventPoint ? '' : `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
                                  <span class="visually-hidden">Open event</span>
                                </button>`;
}

function createResetEditorButtonName(isNewEventPoint, isDeleting) {
  if (isNewEventPoint) {
    return 'Cancel';
  }

  if (isDeleting) {
    return 'Deleting...';
  }

  return 'Delete';
}

function createEditorTemplate(data, destinations) {

  const isNewEventPoint = !data.id;

  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    isDisabled,
    isDeleting,
    isSaving
  } = data;

  const name = destination ? destination.name : '';

  const eventStartDate = formatDateTime(dateFrom, DATETIME_FORMAT);
  const eventEndDate = formatDateTime(dateTo, DATETIME_FORMAT);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            ${createEventTypesListTemplate(type, isDisabled)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${name}"
              list="destination-list-1"
              autocomplete="off"
              ${isDisabled ? 'disabled' : ''}
              required
            />
            <datalist id="destination-list-1">
              ${createDestinationsListTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text" name="event-start-time"
              value="${eventStartDate}"
              ${isDisabled ? 'disabled' : ''}
              required
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${eventEndDate}"
              ${isDisabled ? 'disabled' : ''}
              required
            />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="number"
              min="1"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
              required
            />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${createResetEditorButtonName(isNewEventPoint, isDeleting)}
          </button>
          ${createCloseEditorButtonTemplate(isNewEventPoint, isDisabled)}
        </header>
        ${createEventDetailsTemplate(offers, destination, isDisabled)}
      </form>
    </li>`
  );
}


export default class EditPointView extends AbstractStatefulView {

  #handleCloseEditorButtonClick = null;
  #handleEditorFormSubmit = null;
  #handleEditorFormDelete = null;

  #startDatePicker = null;
  #endDatePicker = null;

  #destinations = [];
  #offers = [];

  constructor(
    {
      eventPoint = NEW_EVENT_POINT,
      destinations,
      offers,
      onCloseEditorButtonClick,
      onEditorFormSubmit,
      onEditorFormDelete
    }) {
    super();
    this._setState(EditPointView.parsePointToState(eventPoint));

    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleCloseEditorButtonClick = onCloseEditorButtonClick;
    this.#handleEditorFormSubmit = onEditorFormSubmit;
    this.#handleEditorFormDelete = onEditorFormDelete;

    this._restoreHandlers();
  }

  get template() {
    return createEditorTemplate(this._state, this.#destinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#startDatePicker || this.#endDatePicker) {
      this.#startDatePicker.destroy();
      this.#endDatePicker.destroy();

      this.#startDatePicker = null;
      this.#endDatePicker = null;
    }
  }

  getChildNode(selector) {
    return this.element.querySelector(selector);
  }

  reset(pointEvent) {
    this.updateElement(EditPointView.parsePointToState(pointEvent));
  }

  _restoreHandlers() {
    if (this._state.id !== null) {
      this.getChildNode('.event__rollup-btn').addEventListener('click', this.#closeEditorButtonClickHandler);
    }
    this.getChildNode('form').addEventListener('submit', this.#editorFormSubmitHandler);
    this.getChildNode('.event__reset-btn').addEventListener('click', this.#editorFormDeleteHandler);
    this.getChildNode('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.getChildNode('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
    this.getChildNode('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);

    if (this._state.destination && this._state.offers.length > 0) {
      this.getChildNode('.event__available-offers').addEventListener('click', this.#pointOfferToggleHandler);
    }

    this.#setDatePickers();
  }

  #closeEditorButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseEditorButtonClick();
  };

  #editorFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditorFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #editorFormDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditorFormDelete(EditPointView.parseStateToPoint(this._state));
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const inputElement = evt.target.closest('.event__type-item').querySelector('.event__type-input');
    if (!inputElement) {
      return;
    }

    const updatedTypeOffers = this.#offers.find(({type}) => type === inputElement.value);

    this.updateElement({
      offers: [...updatedTypeOffers.offers],
      type: inputElement.value
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value
    });
    this.#setPriceFieldValidation();
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();

    const updatedDestination = this.#destinations.find(({name}) => name === evt.target.value);

    if (!updatedDestination) {
      this.updateElement({
        destination:
          {
            id: null,
            description: '',
            name: evt.target.value,
            pictures: []
          }
      });
      this.#setDestinationFieldValidation();
      return;
    }

    this.updateElement({
      destination: updatedDestination,
    });
  };

  #pointOfferToggleHandler = (evt) => {
    evt.preventDefault();
    const offerElement = evt.target.closest('.event__offer-selector');
    if (!offerElement) {
      return;
    }

    const offerElementId = offerElement.querySelector('.event__offer-checkbox').dataset.offerId;
    this.updateElement({
      offers: this._state.offers.map((offer) =>
        offer.id === +offerElementId ? {...offer, checked: !offer.checked} : offer
      )
    });
  };

  #pointStartDateChangeHandler = ([startDate], _, fp) => {
    if(!startDate) {
      fp.setDate(this._state.dateFrom, false, 'd/m/y H:i');
      return;
    }

    this.#endDatePicker.set('minDate', dayjs(startDate).add(1, 'm').toDate());

    this._setState({
      dateFrom: startDate,
    });
  };

  #pointEndDateChangeHandler = ([endDate], _, fp) => {
    if(!endDate) {
      fp.setDate(this._state.dateTo, false, 'd/m/y H:i');
      return;
    }

    this.#startDatePicker.set('maxDate', dayjs(endDate).subtract(1,'m').toDate());

    this._setState({
      dateTo: endDate
    });
  };

  #setDatePickers() {
    const startTimeElement = this.getChildNode('#event-start-time-1');
    const endTimeElement = this.getChildNode('#event-end-time-1');

    this.#startDatePicker = flatpickr(startTimeElement,
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        minuteIncrement: 1,
        dateFormat: 'd/m/y H:i',
        onChange: this.#pointStartDateChangeHandler,
        defaultDate: this._state.dateFrom,
        maxDate: dayjs(this._state.dateTo).subtract(1,'m').toDate(),
      }
    );

    this.#endDatePicker = flatpickr(endTimeElement,
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        minuteIncrement: 1,
        dateFormat: 'd/m/y H:i',
        onChange: this.#pointEndDateChangeHandler,
        defaultDate: this._state.dateTo,
        minDate: dayjs(this._state.dateFrom).add(1,'m').toDate(),
      }
    );
  }

  #setPriceFieldValidation() {
    const priceField = this.getChildNode('.event__input--price');

    if (Number.isInteger(+priceField.value) && +priceField.value >= 1) {
      priceField.setCustomValidity('');
    } else {
      priceField.setCustomValidity('The price must be a positive integer.');
    }
  }

  #setDestinationFieldValidation() {
    const nameDestinationField = this.getChildNode('.event__input--destination');

    const availableCities = this.#destinations.map(({name}) => name);

    if (availableCities.includes(nameDestinationField.value)) {
      nameDestinationField.setCustomValidity('');
    } else {
      nameDestinationField.setCustomValidity('This city is not available.');
    }
  }

  static parsePointToState(eventPoint) {
    return {
      ...eventPoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state){
    const eventPoint = {...state};

    delete eventPoint.isDisabled;
    delete eventPoint.isSaving;
    delete eventPoint.isDeleting;

    return eventPoint;
  }
}

