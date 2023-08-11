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

![image](https://github.com/neronasee/prjctr/assets/15675643/52585d7c-0b9d-4008-8efb-91d823213c83)


### Beanstalkd - Default settings (sync binlog once per 1s)

![image](https://github.com/neronasee/prjctr/assets/15675643/85785a54-84d4-4f44-a52f-d6bdbd013595)


### Redis - NoP

![image](https://github.com/neronasee/prjctr/assets/15675643/69ef208f-94cb-4d2c-88a1-a700cebca8b0)


### Redis - AoF

![image](https://github.com/neronasee/prjctr/assets/15675643/59ad94be-77e1-42a2-9f2d-a69f10e35cdf)


### Redus - RDB

![image](https://github.com/neronasee/prjctr/assets/15675643/0af67a76-404b-4f60-9ba5-ec5c20644f49)

