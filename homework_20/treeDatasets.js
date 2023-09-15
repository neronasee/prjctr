function generateAscending(size) {
  let result = [];
  for (let i = 1; i <= size; i++) {
    result.push(i);
  }
  return result;
}

function generateDescending(size) {
  let result = [];
  for (let i = size; i >= 1; i--) {
    result.push(i);
  }
  return result;
}

function generateRandom(size) {
  let result = [];
  for (let i = 0; i < size; i++) {
    let randomValue = Math.floor(Math.random() * size) + 1;
    result.push(randomValue);
  }
  return result;
}

function generateMultipleDatasets(
  numDatasets,
  minSize,
  maxSize,
  generatorFunction
) {
  const step = Math.floor((maxSize - minSize) / (numDatasets - 1));
  const datasets = [];

  for (let i = 0; i < numDatasets; i++) {
    const currentSize = minSize + step * i;
    datasets.push(generatorFunction(currentSize));
  }

  return datasets;
}

module.exports = {
  generateAscending,
  generateDescending,
  generateMultipleDatasets,
  generateRandom,
};
