# HW15. Balancing - Load Balancer

Set up load balancer on nginx that will have 1 server for UK, 2 servers for US, and 1 server for the rest.

In case of failure, it should send all traffic to backup server.

Health check should happen every 5 seconds\

*Please use ngrok and touch vpn chrome extension


## How to run

```
docker compose up
```

## Test results

To expose our load balancer to web in order to test it via VPN:
```
docker run --net=host -it -e NGROK_AUTHTOKEN=<YOUR_NGROK_AUTH_TOKEN> ngrok/ngrok:latest http 8080
```

### Without VPN

### VPN enabled for US 

US upstream has 2 servers that are chosen by default round robin strategy

### VPN enabled for UK

### Backup server test

We set active healthchecks that track server health with 5 sec interval

we can manually stop docker container with UK server and check results with VPN set as UK

