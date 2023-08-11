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

![image](https://github.com/neronasee/prjctr/assets/15675643/c8a3d91a-4510-4ec4-97e0-14d69fcb0e5c)


### Beanstalkd - Default settings (sync binlog once per 1s)

![image](https://github.com/neronasee/prjctr/assets/15675643/c4492f0b-3eec-4d90-aaae-a389c5bba3c1)


### Redis - NoP

![image](https://github.com/neronasee/prjctr/assets/15675643/1daefaa3-1af0-4a0d-9046-e0cf881a86fc)


### Redis - AoF

![image](https://github.com/neronasee/prjctr/assets/15675643/c13e0628-8f08-4da9-b077-75080320ab6f)


### Redus - RDB

![image](https://github.com/neronasee/prjctr/assets/15675643/6307fa8d-fcf5-4517-a447-5f48ddafd7a3)
