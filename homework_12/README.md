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
![image](https://github.com/neronasee/prjctr/assets/15675643/28b48ed3-7d14-4182-a860-5292008f5bf3)

### allkeys-lfu
![image](https://github.com/neronasee/prjctr/assets/15675643/440dcb21-1aba-42ee-85a1-0d63c83de4f4)

### allkeys-random
![image](https://github.com/neronasee/prjctr/assets/15675643/1bfb736f-beac-41e8-99b9-63e311ab4675)

## Summary

```allkeys-lru``` cache seems to be the most effective for our data we reaching evictions plateau in a shortest amount of time and keeping it relatively low

though ```allkeys-lfu``` might be a better option for other data access models
