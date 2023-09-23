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