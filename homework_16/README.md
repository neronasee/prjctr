# HW16. Logging

Set up MySQL with slow query log 

Configure ELK to work with mysql slow query log 

Configure GrayLog2 to work with mysql slow query log 

Set different thresholds for long_query_time ( 0, 1 , 10 ) and compare performance

## How to run

```docker compose up --build mysql elasticsearch elasticsearch2 logstash kibana mongo graylog filebeat_elk filebeat_graylog telegraf influxdb grafana```

this will spin up

1. mysql with enabled slow query log and `long_query_time` set to 1
2. ELK stack + Filbeat to read slow queries
3. Graylog + Filebeat to read slow queries
4. TIG stack for monitoring

### Set up input in Graylog:
```System -> Inputs -> Add Beats Input -> Use 5050 port for it```

Run benchmarks:

```docker compose up simulate_slow_queries```

this will spin up 10 replicas of script that simulates slow queries `SELECT SLEEP(${sleepTime})` for 100 seconds

## Test results

Graylog and Logstash seem to consume near the same % of CPU time and RAM. Though it should be noted, that Graylog already has visualisation mechanism and in ELK stack it's a separate component, which also consumes resources

![image](https://github.com/neronasee/prjctr/assets/15675643/d7598b4c-be9c-4f1a-8f85-001501a934bc)
