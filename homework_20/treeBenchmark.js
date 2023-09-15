const { AVLTree } = require("./AVLTree");
const {
  generateAscending,
  generateDescending,
  generateRandom,
  generateMultipleDatasets,
} = require("./treeDatasets");

function benchmark(tree, datasets) {
  const results = {};

  function getElapsedMilliseconds(hrtimeStart) {
    const hrtimeEnd = process.hrtime(hrtimeStart);
    // Convert hrtime array ([seconds, nanoseconds]) to milliseconds
    return hrtimeEnd[0] * 1000 + hrtimeEnd[1] / 1000000;
  }

  for (const dataset of datasets) {
    const size = dataset.length;
    results[size] = results[size] || {};

    // Benchmark insert
    let start = process.hrtime();
    for (const value of dataset) {
      tree.insert(value);
    }
    results[size]["insert"] = getElapsedMilliseconds(start);

    // Benchmark find
    start = process.hrtime();
    for (const value of dataset) {
      tree.search(value);
    }
    results[size]["search"] = getElapsedMilliseconds(start);

    // Benchmark delete
    start = process.hrtime();
    for (const value of dataset) {
      tree.delete(value);
    }
    results[size]["delete"] = getElapsedMilliseconds(start);
  }

  return results;
}

const numberOfDatasets = 20;
const minDatasetSize = 100;
const maxDatasetSize = 1000000;

const ascendingDatasets = generateMultipleDatasets(
  numberOfDatasets,
  minDatasetSize,
  maxDatasetSize,
  generateAscending
);
const descendingDatasets = generateMultipleDatasets(
  numberOfDatasets,
  minDatasetSize,
  maxDatasetSize,
  generateDescending
);
const randomDatasets = generateMultipleDatasets(
  numberOfDatasets,
  minDatasetSize,
  maxDatasetSize,
  generateRandom
);

const ascendingBenchmarkResults = benchmark(new AVLTree(), ascendingDatasets);
const descendingBenchmarkResults = benchmark(new AVLTree(), descendingDatasets);
const randomBenchmarkResults = benchmark(new AVLTree(), randomDatasets);

console.log({
  ascendingBenchmarkResults,
  descendingBenchmarkResults,
  randomBenchmarkResults,
});
