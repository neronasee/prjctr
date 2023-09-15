const { countingSort } = require("./countingSort");
const { generateDatasets } = require("./countingSortDatasets");

function benchmarkCountingSort(datasets) {
  const results = {};

  function getElapsedMilliseconds(hrtimeStart) {
    const hrtimeEnd = process.hrtime(hrtimeStart);
    // Convert hrtime array ([seconds, nanoseconds]) to milliseconds
    return hrtimeEnd[0] * 1000 + hrtimeEnd[1] / 1000000;
  }

  for (let dataset of datasets) {
    const size = dataset.length;
    const start = process.hrtime();
    countingSort(dataset);
    const elapsedMilliseconds = getElapsedMilliseconds(start);
    results[size] = elapsedMilliseconds;
  }

  return results;
}

const numOfDatsets = 20;
const bestCaseDatasets = generateDatasets("bestCase", numOfDatsets);
const worstCaseDatasets = generateDatasets("worstCase", numOfDatsets);

const bestCaseBenchmarkResults = benchmarkCountingSort(bestCaseDatasets);
const worstCaseBenchmarkResults = benchmarkCountingSort(worstCaseDatasets);

console.log({
  sortWithBestCaseDatasetsResult: bestCaseBenchmarkResults,
  sortWithWorstCaseDatasetsResult: worstCaseBenchmarkResults,
});
