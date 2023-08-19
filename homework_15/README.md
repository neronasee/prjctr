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

We also can check selected country by nginx's GeoIP module in `X-Selected-Country` header

### Without VPN

![image](https://github.com/neronasee/prjctr/assets/15675643/e5b49b58-622a-4f03-a3cd-823edccb2634)

### VPN enabled for US 

US upstream has 2 servers that are chosen by default round robin strategy

![image](https://github.com/neronasee/prjctr/assets/15675643/a46c2f6f-2b73-47f5-a294-36db20324d9b)
![image](https://github.com/neronasee/prjctr/assets/15675643/07b9b953-979e-41da-babc-f04c9a40fba6)


### VPN enabled for UK

![image](https://github.com/neronasee/prjctr/assets/15675643/a136f954-3801-42cf-8cc9-9aa0fcf15c55)


### Backup server test

We set active healthchecks that track server health with 5 sec interval. Server's statuses can be checked on `/status` 

![image](https://github.com/neronasee/prjctr/assets/15675643/58a3f8ba-b666-41d9-b818-31f173bfe665)


we can manually stop docker container with UK server and check results with VPN set as UK

![image](https://github.com/neronasee/prjctr/assets/15675643/33ff74b3-f919-4ea6-9dc9-ee782c65210c)
![image](https://github.com/neronasee/prjctr/assets/15675643/2fd9c359-ccc3-4d2d-b5df-072e2a88b793)


