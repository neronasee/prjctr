# Homework 12 - Redis Cluster 

Build master-slave redis cluster

Try all eviction strategies

Write a wrapper for Redis Client that implement probabilistic cache 

## Setup 

- docker compose up

## Description

We set up a redis maxmemory to 25mb

For the application we randomly generate some people data in memory and split it into 2 parts

- one group is just 20% of all people, but they're constantly accesed via api (with 90% of times)
- second group is other 80%, but they're accessed not often (10% of times)

All probabilites are simulated in the app code

Probabilistric cache is also implemented to handle hot cache items and is more likely to be used as we come to expiration time for the item

```
recomputationProbability = (maxTTL - ttl) / maxTTL;
```

## Testing results

### noeviction

`Request failed: OOM command not allowed when used memory > 'maxmemory'`

### allkeys-lru

### allkeys-lfu

### allkeys-random