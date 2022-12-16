import { createElement } from '../render.js';
import { destinationMocks, offerMocks } from '../mock/mock-event-point.js';
import { convertDurationTime } from '../utils.js';
import dayjs from 'dayjs';

function createTripEventPointTemplate(eventPoint) {

  // console.log(eventPoint);
  // console.log(offerMocks);

  const {basePrice, dateFrom, dateTo, destination, selectedOffers, isFavorite, type} = eventPoint;
  const {name} = destinationMocks.find((value) => value.id === destination);

  const TITLE_DATE_FORMAT = 'MMM D';
  const DATE_TAG_FORMAT = 'YYYY-MM-DD';

  const TIME_FORMAT = 'HH:mm';

  const eventTitleDate = dayjs(dateFrom).format(TITLE_DATE_FORMAT).toUpperCase();

  const eventStartDate = dayjs(dateFrom).format(DATE_TAG_FORMAT).toUpperCase();
  const eventEndDate = dayjs(dateTo).format(DATE_TAG_FORMAT).toUpperCase();

  const eventStartTime = dayjs(dateFrom).format(TIME_FORMAT).toUpperCase();
  const eventEndTime = dayjs(dateTo).format(TIME_FORMAT).toUpperCase();

  const eventDuration = dayjs(dateTo).second(0).diff(dayjs(dateFrom).second(0),'minutes');

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
          <p class="event__duration">${convertDurationTime(eventDuration)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">20</span>
          </li>
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

  constructor(eventPoint) {
    this.eventPoint = eventPoint;
  }

  getTemplate() {
    return createTripEventPointTemplate(this.eventPoint);
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
