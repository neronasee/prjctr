# HW13. Queues Redis vs Beanstalkd

## Task
Set up 3 containers - beanstalkd and redis (rdb and aof)

Write 2 simple scripts: 1st should put message into queue, 2nd should read from queue.

Configure storing to disk,

Сompare queues performance.

## Description

There are several Docker containers to test Redis and Beanstalkd queue with different settings:

- `redis-producer/beanstalkd-producer` pushes a random message to queue. We use 3 replicas of this
- `redis-consumer/beanstalkd-consumer` consumes messages from queue. We use 3 replicas 
of this
- `redis-metrics/beanstalkd-metrics` collects current queue length and sends it to StatsD

## How to use

### Spin up infrastructure

```
docker compose up redis-master beanstalkd beanstalkd-metrics redis-metrics telegraf influxdb grafana -d
```

### Run benchmarks

```
docker compose up redis-producer  redis-consumer 
```

OR

```
docker compose up  beanstalkd-producer beanstalkd-consumer
```


## Test results

### Beanstalkd - NoP

### Beanstalkd - Default settings (sync binlog once per 1s)

### Redis - NoP

### Redis - AoF

### Redus - RDB

