# Homework 3

## Summary

A system that uses TIG stack for monitoring
- mongodb
- elasticsearch
- nodejs
- nginx

## Run

- docker-compose up
- go to localhost:3000
- Open "Telegraf metrics" dashboard

## Test

You can use Abache Benchmark / Siege to test the monitoring under the workload

Following commands were used to simulate different amounts of load:

- ab -t 200 -c 5 http://localhost:8080/
- ab -t 20 -c 30 http://localhost:8080/
- ab -t 20 -c 40 http://localhost:8080/
- ab -t 120 -c 15 http://localhost:8080/

## Results

### Node.JS app

### Network

### CPU


### Memory

### Disk

### NGINX

### ElasticSearch


### Mongo

### Docker
