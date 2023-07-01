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
![image](https://github.com/neronasee/prjctr/assets/15675643/145df1e0-11f8-4017-b117-e7af62ccc622)

### Network
![image](https://github.com/neronasee/prjctr/assets/15675643/21d8fc49-78c7-43c5-8ad6-7a0012f7c475)

### CPU/Memory
![image](https://github.com/neronasee/prjctr/assets/15675643/b37cec73-ac64-4135-ab60-8923d9ee400c)

### Disk
![image](https://github.com/neronasee/prjctr/assets/15675643/6cabaf73-8d8f-4882-84bb-0a437c216ea0)



### NGINX

![image](https://github.com/neronasee/prjctr/assets/15675643/fb161a05-e67e-4437-9c78-a7bb12bf9707)


### ElasticSearch

![image](https://github.com/neronasee/prjctr/assets/15675643/5aad2e24-dc50-47b0-bde8-5c4d42b7d47a)

![image](https://github.com/neronasee/prjctr/assets/15675643/9ae3dd5b-d520-4ad9-8198-163a72e59eb9)


### Mongo

![image](https://github.com/neronasee/prjctr/assets/15675643/44d7c98a-f598-488e-8d69-ce543ce6c624)


### Docker

![image](https://github.com/neronasee/prjctr/assets/15675643/4f628daf-0336-45de-acd5-7521817464ed)

