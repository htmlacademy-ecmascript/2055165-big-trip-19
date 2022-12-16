import { EVENT_TYPES } from '../constants.js';
import { getRandomIntNumber, getRandomArrElement, getUniqueRandomArrElements } from '../utils.js';

const DESTINATION_MOCKS_COUNT = 10;
const MAX_PICTURES_COUNT = 5;
const MAX_OFFERS_COUNT = 6;
const MAX_EVENT_MOCKS_COUNT = 5;

const MIN_MOCK_PRICE = 100;
const MAX_MOCK_PRICE = 1000;

const CITY_MOCKS = ['Chamonix', 'Amsterdam', 'Rome', 'Moscow', 'Geneva', 'Warsaw', 'Istanbul', 'Oslo', 'Berlin', 'Paris'];

const CITIES_DESCRIPTIONS_MOCKS = {
  'Chamonix': 'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it`s renowned for its skiing.',
  'Amsterdam': 'Amsterdam is the pearl of Northern Europe, the "Venice of the North", a city of amazing architecture, hundreds of canals and thousands of bridges.',
  'Rome': 'Rome is the cradle of a great civilization and the center of one of the greatest empires in human history. It is a city that has absorbed thousands of years of history, experienced an amazing flowering and a resounding decline.',
  'Moscow': 'Moscow is the largest capital of Europe, filled with sights, historical and cultural monuments, as well as world-class museums.',
  'Geneva': 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.',
  'Warsaw':'Warsaw is the capital of Poland and the largest city in the country with a complicated history and destiny. It is an interesting combination of antiquity and tradition, modern pace of life and energy of a large metropolis.',
  'Istanbul': 'Istanbul is the only city in the world that is located in two parts of the world at once - Europe and Asia. It is an ancient megalopolis, which throughout its history was the capital of three great empires: the Roman, Byzantine and Ottoman.',
  'Oslo': 'Oslo is a surprisingly compact, comfortable and relaxed city where modern landscapes coexist with the stunning natural beauty of fjords and wooded hills.',
  'Berlin': 'Berlin is a major metropolis, a city of diverse architecture, museums and palaces, interesting sights and a lively nightlife.',
  'Paris': 'Paris is one of the most romantic and fashionable cities in the world, which attracts millions of tourists with its famous sights, magnificent architecture, fashionable boutiques and special atmosphere of love and freedom.'
};

const TIMESLOTS_MOCKS = [
  {
    start: '2022-07-10T22:55:56.845Z',
    end: '2022-07-12T20:00:06.845Z'
  },
  {
    start: '2022-07-08T10:35:00.845Z',
    end: '2022-07-10T21:00:06.845Z'
  },
  {
    start: '2022-08-20T09:35:00.845Z',
    end: '2022-08-25T09:35:00.845Z'
  },
  {
    start: '2022-08-05T14:00:00.845Z',
    end: '2022-08-19T15:00:00.845Z'
  },
  {
    start: '2022-06-11T06:35:00.845Z',
    end: '2022-06-14T08:31:10.845Z'
  },
  {
    start: '2022-06-14T19:15:05.845Z',
    end: '2022-06-14T19:31:10.845Z'
  },
  {
    start: '2022-09-01T00:00:00.845Z',
    end: '2022-09-03T20:00:10.845Z'
  },
  {
    start: '2022-09-03T21:15:05.845Z',
    end: '2022-09-03T21:30:10.845Z'
  },
  {
    start: '2022-09-04T21:15:05.845Z',
    end: '2022-09-04T22:15:05.845Z'
  },
  {
    start: '2022-09-10T21:15:05.845Z',
    end: '2022-09-11T11:30:10.845Z'
  },
];

function createDestinationMock(id, name, description) {

  const destinationMock = {
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
    destinationMock.pictures.push(picture);
  }

  return destinationMock;
}

function createOfferMocksByType (type) {

  const typeOffers = {
    type,
    offers: []
  };

  for (let i = 0; i < getRandomIntNumber(0, MAX_OFFERS_COUNT); i++) {
    const offer = {
      id: i + 1,
      title: `additional offer #${i + 1} for type ${type} with megaprice`,
      price: getRandomIntNumber(MIN_MOCK_PRICE, MAX_MOCK_PRICE)
    };
    typeOffers.offers.push(offer);
  }

  return typeOffers;
}

function createPointEventMock(id, {start, end}) {

  const pointEventMock = {
    basePrice: getRandomIntNumber(MIN_MOCK_PRICE, MAX_MOCK_PRICE),
    dateFrom: start,
    dateTo: end,
    destination: getRandomIntNumber(1, DESTINATION_MOCKS_COUNT),
    id: id,
    isFavorite: Math.random() < 0.5,
    selectedOffers: getUniqueRandomArrElements(getRandomIntNumber(1, MAX_OFFERS_COUNT), Array.from({length: getRandomIntNumber(1, MAX_OFFERS_COUNT)}, (_, index) => index + 1)).sort(),
    type: getRandomArrElement(EVENT_TYPES),
  };

  return pointEventMock;
}

const destinationMocks = Array.from(
  {length: DESTINATION_MOCKS_COUNT},
  (_, index) => createDestinationMock(index + 1, CITY_MOCKS[index], CITIES_DESCRIPTIONS_MOCKS[CITY_MOCKS[index]])
);

const offerMocks = Array.from(
  {length: EVENT_TYPES.length},
  (_, index) => createOfferMocksByType(EVENT_TYPES[index])
);

const pointEventMocks = Array.from(
  { length: MAX_EVENT_MOCKS_COUNT },
  (_, index) => createPointEventMock(index + 1, getRandomArrElement(TIMESLOTS_MOCKS))
);

function getRandomEventMocks(mocksCount) {
  return getUniqueRandomArrElements(mocksCount, pointEventMocks);
}

export { getRandomEventMocks, offerMocks, destinationMocks };
