import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDateTime } from '../utils/point-event-utils.js';
import { EventTypes, DEFAULT_EVENT_TYPE } from '../constants.js';

const DATETIME_FORMAT = 'DD/MM/YY HH:mm';

const NEW_EVENT_POINT = {
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_EVENT_TYPE,
};

function createEventTypesListTemplate(currentType) {
  const typesList = Object.values(EventTypes).map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>`
  ).join('');

  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesList};
            </fieldset>
          </div>`;
}

function createTypeOffersListTemplate(typeOffers) {
  if (typeOffers.length === 0) {
    return '';
  }

  const offersList = typeOffers.map(({id, title, price, checked}) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}"${checked ? ' checked' : ''}>
      <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('');

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersList}
            </div>
          </section>`;
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

function createEventDetailsTemplate(offers, destination) {

  if (!destination) {
    return '';
  }

  return `<section class="event__details">
          ${createTypeOffersListTemplate(offers)}
          ${createEventDescriptionTemplate(destination)}
          </section>`;
}

function createEditorTemplate(data) {

  const isNewEventPoint = !data.id;
  const eventPoint = isNewEventPoint ? NEW_EVENT_POINT : data;

  const {basePrice, dateFrom, dateTo, destination, offers, type} = eventPoint;

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
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${createEventTypesListTemplate(type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventStartDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventEndDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isNewEventPoint ? 'Cancel' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${createEventDetailsTemplate(offers, destination)}
      </form>
    </li>`
  );
}


export default class EditPointView extends AbstractStatefulView {

  #handleCloseEditorButtonClick = null;
  #handleEditorFormSubmit = null;

  constructor({eventPoint, onCloseEditorButtonClick, onEditorFormSubmit}) {
    super();
    this._setState(EditPointView.parsePointToState(eventPoint));

    this.#handleCloseEditorButtonClick = onCloseEditorButtonClick;
    this.#handleEditorFormSubmit = onEditorFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createEditorTemplate(this._state);
  }

  getChildNode(selector) {
    return this.element.querySelector(selector);
  }

  reset(pointEvent) {
    this.updateElement(EditPointView.parsePointToState(pointEvent));
  }

  _restoreHandlers() {
    this.getChildNode('.event__rollup-btn').addEventListener('click', this.#closeEditorButtonClickHandler);
    this.getChildNode('form').addEventListener('submit', this.#editorFormSubmitHandler);
    this.getChildNode('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.getChildNode('.event__input--price').addEventListener('input', this.#pointPriceInputHandler);

    if (this._state.offers.length > 0) {
      this.getChildNode('.event__available-offers').addEventListener('click', this.#pointOfferToggleHandler);
    }

  }

  #closeEditorButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseEditorButtonClick();
  };

  #editorFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditorFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const inputElement = evt.target.closest('.event__type-item').querySelector('.event__type-input');
    if (!inputElement) {
      return;
    }

    this.updateElement({
      type: inputElement.value
    });
  };

  #pointPriceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value
    });
  };

  #pointOfferToggleHandler = (evt) => {
    evt.preventDefault();
    const offerElement = evt.target.closest('.event__offer-selector').querySelector('.event__offer-checkbox');
    if (!offerElement) {
      return;
    }

    const offerElementId = offerElement.id.replace('event-offer-', '');
    this.updateElement({
      offers: this._state.offers.map((offer) =>
        offer.id === +offerElementId ? {...offer, checked: !offer.checked} : offer
      )
    });
  };

  static parsePointToState(eventPoint) {
    return {
      ...eventPoint
    };
  }

  static parseStateToPoint(state){
    const eventPoint = {...state};
    return eventPoint;
  }
}
