const { AVLTree } = require("./AVLTree");
const heapdump = require("heapdump");

function getElapsedMilliseconds(hrtimeStart) {
  const hrtimeEnd = process.hrtime(hrtimeStart);
  return hrtimeEnd[0] * 1000 + hrtimeEnd[1] / 1000000;
}

function* getRandomGenerator(size) {
  for (let i = 0; i < size; i++) {
    let randomValue = Math.floor(Math.random() * size) + 1;
    yield randomValue;
  }
}

function benchmark(tree, datasetGenerator) {
  const results = {};

  // Benchmark insert
  let start = process.hrtime();
  for (const value of datasetGenerator()) {
    tree.add(value);
  }
  results["insert"] = getElapsedMilliseconds(start);

  // Benchmark find
  start = process.hrtime();
  for (const value of datasetGenerator()) {
    tree.search(value);
  }
  results["search"] = getElapsedMilliseconds(start);

  // Benchmark delete
  start = process.hrtime();
  for (const value of datasetGenerator()) {
    tree.delete(value);
  }
  results["delete"] = getElapsedMilliseconds(start);

  heapdump.writeSnapshot("./" + Date.now() + ".heapsnapshot");
  return results;
}

function benchmark2pow18() {
  benchmark(new AVLTree(), () => getRandomGenerator(Math.pow(2, 18)));
}
function benchmark2pow19() {
  benchmark(new AVLTree(), () => getRandomGenerator(Math.pow(2, 19)));
}
function benchmark2pow20() {
  benchmark(new AVLTree(), () => getRandomGenerator(Math.pow(2, 20)));
}
function benchmark2pow21() {
  benchmark(new AVLTree(), () => getRandomGenerator(Math.pow(2, 21)));
}
function benchmark2pow22() {
  benchmark(new AVLTree(), () => getRandomGenerator(Math.pow(2, 22)));
}
function benchmark2pow23() {
  benchmark(new AVLTree(), () => getRandomGenerator(Math.pow(2, 23)));
}
function benchmark2pow24() {
  benchmark(new AVLTree(), () => getRandomGenerator(Math.pow(2, 24)));
}

benchmark2pow18();
benchmark2pow19();
benchmark2pow20();
benchmark2pow21();
benchmark2pow22();
benchmark2pow23();
benchmark2pow24();
