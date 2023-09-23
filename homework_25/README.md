# Homework 25: Operation Tree Profiling

Implement Balanced Binary Search Tree class and operations of insert/delete/search

Profile space usage ( Confirm that you see O (n) )

Profile time consumption ( Confirm that you see O (log n))

## How to run

We'll use tree from Homework 20

Profiling inside Docker container is a bit of complicated, so we'll use NodeJS directly

```
npm i -g clinic
npm i

clinic flame -- node treeBenchmark.js 
```

This will generate a flame chart of CPU usage.

Also after every benchmark for a giver dataset we do a heapdump, so we can measure memory allocated for every tree instance by loading it to a Google Chrome (`Dev tools -> Memory -> Load Profile`)

In order to see different function names on flame chart, we need to explicitly change their name and to include a dataset name in it, so they can be distinguished. E.g.

```
benchmark2pow18();
benchmark2pow19();
benchmark2pow20();
benchmark2pow21();
benchmark2pow22();
benchmark2pow23();
benchmark2pow24();
```

## Test results

### CPU time

![image](https://github.com/neronasee/prjctr/assets/15675643/442bbbff-f975-4171-9d74-88f701117eaf)

We can observe that time spent in different benchmarks for different datasets is logarithmically proportional to the size of it's data set

### Memory allocations for different datasets

![image](https://github.com/neronasee/prjctr/assets/15675643/0f1f8021-ad20-4b0d-85e0-b713c616b40c)
![image](https://github.com/neronasee/prjctr/assets/15675643/e4b6d136-f2ab-4554-bab4-dac3e6811536)
![image](https://github.com/neronasee/prjctr/assets/15675643/599df9c2-c31e-4a25-9219-7d1d57d957df)

We can observe that memory allocated for a tree is linearly proportional to the dataset size
