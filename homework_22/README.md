# HW-22 - sharding

Create 3 docker containers: postgresql-b, postgresql-b1, postgresql-b2

Setup horizontal/vertical sharding as it’s described in this lesson and  with alternative tool ( citus, pgpool-|| etc )

Insert 1 000 000 rows into books

Measure performance for reads and writes

Do the same without sharding

Compare performance of 3 cases ( without sharding, FDW, and approach of your choice )

## How to run

Run 3 set of dbs we'll test aginst:

```
docker compose up postgres postgres-partitioned citus-master citus-manager citus-worker-1 citus-worker-2
```

Run benchmark:

docker compose up benchmark

## Test results

|                                                         | Read ops/sec | Write ops/sec |
|---------------------------------------------------------|--------------|---------------|
| Default single node PG isntance                         | 22134        | 2064          |
| Using INHERIT with insert rules on a single PG Instance | 14057        | 2735          |
| With Citus with 2 worker nodes                          | 7100         | 603           |

Sharding on a single instance seems to increase write performance and to decrease read ops/sec

Both Reads and Inserts using Citus perform noticeably worse, which is a result of Citus overhead itself, though if multiple physical nodes were used, this would result in increasing Write throughput 