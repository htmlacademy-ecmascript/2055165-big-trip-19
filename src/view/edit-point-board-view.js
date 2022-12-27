import AbstractView from '../framework/view/abstract-view.js';
import { formatDateTime } from '../utils/point-event-utils.js';
import { EventTypes, DEFAULT_EVENT_TYPE } from '../constants.js';

const DATETIME_FORMAT = 'DD/MM/YY HH:mm';

const NEW_EVENT_POINT = {
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: '',
  id: '0',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

function createEventTypesListTemplate() {
  const typesList = Object.values(EventTypes).map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === DEFAULT_EVENT_TYPE ? 'checked' : ''}>
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

function createTypeOffersListTemplate(selectedOffers, typeOffers) {
  if (!typeOffers || typeOffers.offers.length === 0) {
    return '';
  }

  const offersList = typeOffers.offers.map(({id, title, price}) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}"${selectedOffers.includes(id) ? ' checked' : ''}>
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

function createEventDetailsTemplate(typeOffers, selectedOffers, eventDescription) {
  const typeOffersListTemplate = createTypeOffersListTemplate(selectedOffers, typeOffers);
  const eventDescriptionTemplate = createEventDescriptionTemplate(eventDescription);

  return `<section class="event__details">
          ${typeOffersListTemplate}
          ${eventDescriptionTemplate}
          </section>`;
}

function createEditPointBoardTemplate(eventPoint, destination, typeOffers) {

  const eventTypesListTemplate = createEventTypesListTemplate();

  const isNewEventPoint = !eventPoint.id || eventPoint.id === '0';

  if (isNewEventPoint) {
    eventPoint = NEW_EVENT_POINT;
    typeOffers = '';
    destination = '';
  }

  const {basePrice, dateFrom, dateTo, offers, type} = eventPoint;
  const {name, description, pictures} = destination;

  const eventDetailsTemplate = (!isNewEventPoint && (typeOffers.offers.length > 0 || description || pictures.length > 0)) ? createEventDetailsTemplate(typeOffers, offers, destination) : '';

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
            ${eventTypesListTemplate}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name ? name : ''}" list="destination-list-1">
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
        ${eventDetailsTemplate}
      </form>
    </li>`
  );
}


export default class EditPointBoardView extends AbstractView {
  #eventPoint = null;
  #destination = null;
  #typeOffers = null;

  #handleClosePointBoardButtonClick = null;
  #handlePointBoardFormSubmit = null;


  constructor({
    eventPoint,
    destination,
    typeOffers,
    onClosePointBoardButtonClick,
    onPointBoardFormSubmit
  }) {
    super();
    this.#eventPoint = eventPoint;
    this.#destination = destination;
    this.#typeOffers = typeOffers;

    this.#handleClosePointBoardButtonClick = onClosePointBoardButtonClick;
    this.#handlePointBoardFormSubmit = onPointBoardFormSubmit;

    this.getChildNode('.event__rollup-btn').addEventListener('click', this.#closePointBoardButtonClickHandler);
    this.getChildNode('form').addEventListener('submit', this.#pointBoardFormSubmitHandler);
  }

  get template() {
    return createEditPointBoardTemplate(this.#eventPoint, this.#destination, this.#typeOffers);
  }

  getChildNode(selector) {
    return this.element.querySelector(selector);
  }

  #closePointBoardButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClosePointBoardButtonClick();
  };

  #pointBoardFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handlePointBoardFormSubmit(this.#eventPoint);
  };
}
