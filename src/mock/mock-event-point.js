import { EVENT_TYPES_LIST } from '../constants.js';
import { getRandomIntNumber, getRandomArrElement, getUniqueRandomArrElements } from '../utils/common.js';

const DESTINATIONS_COUNT = 10;
const MAX_PICTURES_COUNT = 5;
const MAX_OFFERS_COUNT = 6;
const MAX_SELECTED_OFFERS_COUNT = 3;
const MAX_EVENTS_COUNT = 9;

const MIN_PRICE = 100;
const MAX_PRICE = 1000;

const CITY_NAMES = ['Chamonix', 'Amsterdam', 'Rome', 'Moscow', 'Geneva', 'Warsaw', 'Istanbul', 'Oslo', 'Berlin', 'Paris'];

const CITIES_DESCRIPTIONS = {
  'Chamonix': 'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it`s renowned for its skiing.',
  'Amsterdam': 'Amsterdam is the pearl of Northern Europe, the "Venice of the North", a city of amazing architecture, hundreds of canals and thousands of bridges.',
  'Rome': 'Rome is the cradle of a great civilization and the center of one of the greatest empires in human history. It is a city that has absorbed thousands of years of history, experienced an amazing flowering and a resounding decline.',
  'Moscow': '',
  'Geneva': 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.',
  'Warsaw': '',
  'Istanbul': 'Istanbul is the only city in the world that is located in two parts of the world at once - Europe and Asia. It is an ancient megalopolis, which throughout its history was the capital of three great empires: the Roman, Byzantine and Ottoman.',
  'Oslo': 'Oslo is a surprisingly compact, comfortable and relaxed city where modern landscapes coexist with the stunning natural beauty of fjords and wooded hills.',
  'Berlin': '',
  'Paris': 'Paris is one of the most romantic and fashionable cities in the world, which attracts millions of tourists with its famous sights, magnificent architecture, fashionable boutiques and special atmosphere of love and freedom.'
};

const TIMESLOTS = [
  {
    start: '2022-07-10T22:55:56.845Z',
    end: '2022-07-12T20:00:06.845Z'
  },
  {
    start: '2022-06-08T10:35:00.845Z',
    end: '2022-07-05T21:00:06.845Z'
  },
  {
    start: '2022-08-20T09:35:00.845Z',
    end: '2022-08-25T09:35:00.845Z'
  },
  {
    start: '2022-12-24T14:00:00.845Z',
    end: '2022-12-24T16:36:00.845Z'
  },
  {
    start: '2022-12-24T00:35:00.845Z',
    end: '2022-12-24T13:39:10.845Z'
  },
  {
    start: '2022-12-20T19:15:05.845Z',
    end: '2022-12-27T19:31:10.845Z'
  },
  {
    start: '2022-12-23T00:00:00.845Z',
    end: '2023-01-01T20:00:10.845Z'
  },
  {
    start: '2023-02-01T21:15:05.845Z',
    end: '2023-02-01T21:30:10.845Z'
  },
  {
    start: '2023-01-04T21:15:05.845Z',
    end: '2023-01-05T22:15:05.845Z'
  },
  {
    start: '2023-01-10T21:15:05.845Z',
    end: '2023-01-15T11:30:10.845Z'
  },
];

function createDestinationMock(id, name, description) {

  const destination = {
    id,
    description,
    name,
    pictures: []
  };

  for (let i = 0; i < getRandomIntNumber(0, MAX_PICTURES_COUNT); i++) {
    const picture = {
      src: `http://picsum.photos/300/200?r=${Math.random()}`,
      description: `picture-${i} description`
    };
    destination.pictures.push(picture);
  }

  return destination;
}

function createOfferMocksByType(type) {

  const typeOffers = {
    type,
    offers: []
  };

  for (let i = 0; i < getRandomIntNumber(0, MAX_OFFERS_COUNT); i++) {
    const offer = {
      id: i + 1,
      title: `additional offer #${i + 1} for type ${type} with megaprice`,
      price: getRandomIntNumber(MIN_PRICE, MAX_PRICE)
    };
    typeOffers.offers.push(offer);
  }

  return typeOffers;
}

function createPointEventMock(id, { start, end }) {

  const pointEvent = {
    basePrice: getRandomIntNumber(MIN_PRICE, MAX_PRICE),
    dateFrom: start,
    dateTo: end,
    destination: getRandomIntNumber(1, DESTINATIONS_COUNT),
    id: id,
    isFavorite: Math.random() < 0.5,
    offers: getUniqueRandomArrElements(getRandomIntNumber(0, MAX_SELECTED_OFFERS_COUNT), Array.from({ length: getRandomIntNumber(1, MAX_OFFERS_COUNT) }, (_, index) => index + 1)).sort(),
    type: getRandomArrElement(EVENT_TYPES_LIST),
  };

  return pointEvent;
}

const destinationMocks = Array.from(
  { length: DESTINATIONS_COUNT },
  (_, index) => createDestinationMock(index + 1, CITY_NAMES[index], CITIES_DESCRIPTIONS[CITY_NAMES[index]])
);

const offerMocks = Array.from(
  { length: EVENT_TYPES_LIST.length },
  (_, index) => createOfferMocksByType(EVENT_TYPES_LIST[index])
);

const pointEventMocks = Array.from(
  { length: MAX_EVENTS_COUNT },
  (_, index) => createPointEventMock(index + 1, getRandomArrElement(TIMESLOTS))
);

function getRandomEventMocks(mocksCount) {
  return getUniqueRandomArrElements(mocksCount, pointEventMocks);
}

export { getRandomEventMocks, offerMocks, destinationMocks };
