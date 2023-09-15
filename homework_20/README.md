# HW20. Data Structures and Algorithms

BST and Counting Sort 

Implement class for Balanced Binary Search Tree that can insert, find and delete elements.

Generate 100 random datasets and measure complexity

Implement Counting Sort algorithm

Figure out when Counting Sort doesn’t perform.

## How to run

```
docker compose up counting-sort-benchmark
docker compose up tree-benchmark
```


## Test results

Can be found in this [Google Sheets document](https://docs.google.com/spreadsheets/d/1MMLyyGm1xNJmMsKbz81S699ihC-AZ6Mqtd0ILpXnRuk/edit?usp=sharing)


### Balanced BST tree
Tree benchmark shows logarithmic complexity for all datasets

### Counting Sort
The Counting Sort is very suitable for datasets with low range of different values and degrades very quickly if there're a lot of unique values that need to be sorted

