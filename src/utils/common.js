const getRandomIntNumber = (min, max) => {
  if ((!Number.isFinite(min) || !Number.isFinite(max)) || (min < 0 || max < 0)) {
    return NaN;
  }

  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
};

const getRandomArrElement = (array) => array[getRandomIntNumber(0, array.length - 1)];

const getUniqueRandomArrElements = (elementsCount, sourceArray) => {
  const uniqueSourceArray = Array.from(new Set(sourceArray));

  if (elementsCount > uniqueSourceArray.length) {
    return uniqueSourceArray;
  }

  const resultElements = [];

  for (let i = 0; i < elementsCount; i++) {
    let element = getRandomArrElement(uniqueSourceArray);
    while (resultElements.includes(element)) {
      element = getRandomArrElement(uniqueSourceArray);
    }

    resultElements.push(element);
  }

  return resultElements;
};

export { getRandomIntNumber, getRandomArrElement, getUniqueRandomArrElements };
