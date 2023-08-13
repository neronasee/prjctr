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

command used for testing:

```
siege -d -c 10 -t 10m "http://localhost:5050/randomPerson"
```

### noeviction

`Request failed: OOM command not allowed when used memory > 'maxmemory'`

### allkeys-lru
![image](https://github.com/neronasee/prjctr/assets/15675643/1085ad77-d5f3-4490-8907-ea0f2c3d8657)


### allkeys-lfu
![image](https://github.com/neronasee/prjctr/assets/15675643/d6858940-8097-4ff2-adfb-ae83eb7984db)


### allkeys-random
![image](https://github.com/neronasee/prjctr/assets/15675643/3202996e-b462-45f0-8266-ab2ee1f52853)


## Summary

```allkeys-lru``` cache seems to be the most effective for our data we reaching evictions plateau in a shortest amount of time and keeping it relatively low

though ```allkeys-lfu``` might be a better option for other data access models
