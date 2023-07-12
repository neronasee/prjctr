# Homework 5

## Summary

Stress testing the application

## Install 

- `docker compose up`
- `cd siege` && `docker build -t siege .` 

## Test results

`docker run --rm --network=homework_5_siege-network siege -d1 -r50 -c10 -f ./urls.txt`

```
Transactions:                    500 hits
Availability:                 100.00 %
Elapsed time:                  29.58 secs
Data transferred:               0.81 MB
Response time:                  0.01 secs
Transaction rate:              16.90 trans/sec
Throughput:                     0.03 MB/sec
Concurrency:                    0.24
Successful transactions:         500
Failed transactions:               0
Longest transaction:            0.26
Shortest transaction:           0.00

```

`docker run --rm --network=homework_5_siege-network siege -d1 -r50 -c25 -f ./urls.txt`

```
Transactions:                   1250 hits
Availability:                 100.00 %
Elapsed time:                  32.40 secs
Data transferred:               2.01 MB
Response time:                  0.01 secs
Transaction rate:              38.58 trans/sec
Throughput:                     0.06 MB/sec
Concurrency:                    0.56
Successful transactions:        1250
Failed transactions:               0
Longest transaction:            0.30
Shortest transaction:           0.00

```

`docker run --rm --network=homework_5_siege-network siege -d1 -r50 -c50 -f ./urls.txt`

```
Transactions:                   2500 hits
Availability:                 100.00 %
Elapsed time:                  32.95 secs
Data transferred:               4.03 MB
Response time:                  0.03 secs
Transaction rate:              75.87 trans/sec
Throughput:                     0.12 MB/sec
Concurrency:                    2.32
Successful transactions:        2500
Failed transactions:               0
Longest transaction:            1.11
Shortest transaction:           0.00

```

`docker run --rm --network=homework_5_siege-network siege -d1 -r50 -c100 -f ./urls.txt`

```
Transactions:                   5000 hits
Availability:                 100.00 %
Elapsed time:                  67.54 secs
Data transferred:               8.06 MB
Response time:                  0.70 secs
Transaction rate:              74.03 trans/sec
Throughput:                     0.12 MB/sec
Concurrency:                   51.58
Successful transactions:        5000
Failed transactions:               0
Longest transaction:            8.30
Shortest transaction:           0.00

```