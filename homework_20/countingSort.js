function countingSort(arr) {
  if (arr.length <= 1) return arr;

  // Find the maximum value in the array
  let maxValue = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
    }
  }

  // Initialize the count array with zeros
  let countArray = new Array(maxValue + 1).fill(0);

  // Populate the count array with the frequency of each number in the original array
  for (let i = 0; i < arr.length; i++) {
    countArray[arr[i]]++;
  }

  // Reconstruct the sorted array using the count array
  let sortedIndex = 0;
  for (let i = 0; i < countArray.length; i++) {
    while (countArray[i] > 0) {
      arr[sortedIndex++] = i;
      countArray[i]--;
    }
  }

  return arr;
}

module.exports = { countingSort };
