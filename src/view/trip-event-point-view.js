import { createElement } from '../render.js';
import {formatDateTime, getTimeDuration } from '../utils.js';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const TITLE_DATE_FORMAT = 'MMM D';
const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

function createOffersListTemplate(offers) {
  if (!offers) {
    return '';
  }

  return offers.map(({title, price}) =>
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>` ).join('');
}

function createTripEventPointTemplate(eventPoint, destination, typeOffers) {

  const {basePrice, dateFrom, dateTo, offers, isFavorite, type} = eventPoint;
  const {name} = destination;

  let selectedOffers = null;

  if (typeOffers) {
    selectedOffers = typeOffers.offers.filter((offer) => offers.includes(offer.id));
  }

  const offersListTemplate = createOffersListTemplate(selectedOffers);

  const eventTitleDate = formatDateTime(dateFrom, TITLE_DATE_FORMAT);

  const eventStartDate = formatDateTime(dateFrom, DATE_FORMAT);
  const eventEndDate = formatDateTime(dateTo, DATE_FORMAT);

  const eventStartTime = formatDateTime(dateFrom, TIME_FORMAT);
  const eventEndTime = formatDateTime(dateTo, TIME_FORMAT);

  const eventDuration = getTimeDuration(dateFrom, dateTo);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${eventStartDate}">${eventTitleDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${eventStartDate}T${eventStartTime}">${eventStartTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${eventEndDate}T${eventEndTime}">${eventEndTime}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersListTemplate}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : '' }" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class TripEventPointView {

  constructor(eventPoint, destination, typeOffers) {
    this.eventPoint = eventPoint;
    this.destination = destination;
    this.typeOffers = typeOffers;
  }

  getTemplate() {
    return createTripEventPointTemplate(this.eventPoint, this.destination, this.typeOffers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
