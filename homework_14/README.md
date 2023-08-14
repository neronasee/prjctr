# HW14.Content Delivery Network - Handmade CDN

Your goal is to create your own cdn for delivering millions of images across the globe.
Set up 7 containers - bind server, load balancer 1, load balancer 2, node1, node2, node3, node 4. Try to implement different balancing approaches. Implement efficient caching Write down pros and cons of each approach

## How to run

```
docker compose up bind-dns load-balancer-1 load-balancer-2 node1 node2 node3
```

## How to Test

To enable GeoDNS - use `acl "ua"` in `match-clients` for `ua-view`


```
docker compose up dns-test-world
```

OR

```
docker compose up dns-test-ua
```



We simulate the `UA` view in `named.conf.local` by using 
```
acl "ua-test" {
    192.168.0.0/27;
};
```
Also we assign IPs to containers in our `docker-compose.yaml`:

- `dns-test-ua` container with `192.168.0.23`
- `dns-test-world` container with `192.168.0.100`


## Test results:

### ```docker compose up dns-test-ua```

```
Request 1:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 2:
<body>
    <h1>Node 2</h1>
    <img src="node2.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 3:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 4:
<body>
    <h1>Node 2</h1>
    <img src="node2.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 5:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 6:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 7:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 8:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 9:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 10:
<body>
    <h1>Node 1</h1>
    <img src="node1.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
```

### ```docker compose up dns-test-world```

```

Request 1:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 2:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 3:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 4:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 5:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: MISS
Request 6:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 7:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 8:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 9:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT
Request 10:
<body>
    <h1>Node 3</h1>
    <img src="node3.jpeg" alt="A sample image">
</body>
X-Proxy-Cache: HIT

```