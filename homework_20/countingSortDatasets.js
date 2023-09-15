// Generates an array with many duplicates and a small range (best case for counting sort)
function generateBestCaseDataset(size) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (size / 5))
  ); // "size / 5" ensures many duplicates
}

// Generates an array with a wide range of values (worst case for counting sort)
function generateWorstCaseDataset(size) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (size * 5))
  ); // "size * 5" ensures a large range
}

function generateDatasets(datasetType, count) {
  const datasetGenerator =
    datasetType === "bestCase"
      ? generateBestCaseDataset
      : generateWorstCaseDataset;

  const datasets = [];
  for (let i = 1; i <= count; i++) {
    // Here, each dataset size will be incremented by a factor (e.g., 1000)
    datasets.push(datasetGenerator(i * 1000 * 5));
  }

  return datasets;
}

module.exports = {
  generateBestCaseDataset,
  generateWorstCaseDataset,
  generateDatasets,
};
