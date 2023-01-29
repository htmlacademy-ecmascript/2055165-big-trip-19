const collapseAdjacentDuplicates = (array) =>
  array.filter((value, index, arr) => arr[index + 1] !== value);

export { collapseAdjacentDuplicates };
