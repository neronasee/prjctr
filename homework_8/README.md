# Homework 8 - Nginx Fine Tuning

## Description

Configure nginx that will cache only images, that were requested at least twice 

Add ability to drop nginx cache by request. 

You should drop cache for specific file only ( not all cache )

<hr> 

## Testing results:

### 2 MISSes:

```
curl -I -X GET localhost:8080/images/cat.jpeg
HTTP/1.1 200 OK
Server: openresty/1.21.4.1
Date: Fri, 21 Jul 2023 10:40:22 GMT
Content-Type: image/jpeg
Content-Length: 5891
Connection: keep-alive
Last-Modified: Thu, 20 Jul 2023 10:08:21 GMT
ETag: "64b90795-1703"
Accept-Ranges: bytes
X-Cache-Status: MISS
```

```
curl -I -X GET localhost:8080/images/cat.jpeg
HTTP/1.1 200 OK
Server: openresty/1.21.4.1
Date: Fri, 21 Jul 2023 10:40:33 GMT
Content-Type: image/jpeg
Content-Length: 5891
Connection: keep-alive
Last-Modified: Thu, 20 Jul 2023 10:08:21 GMT
ETag: "64b90795-1703"
X-Cache-Status: MISS
Accept-Ranges: bytes
```

### HIT

```
curl -I -X GET localhost:8080/images/cat.jpeg
HTTP/1.1 200 OK
Server: openresty/1.21.4.1
Date: Fri, 21 Jul 2023 10:41:04 GMT
Content-Type: image/jpeg
Content-Length: 5891
Connection: keep-alive
Last-Modified: Thu, 20 Jul 2023 10:08:21 GMT
ETag: "64b90795-1703"
X-Cache-Status: HIT
Accept-Ranges: bytes
```

### Making sure cache works properly:

```
mv cat.jpeg parrot.jpeg
```

```
curl -I -X GET localhost:8080/images/cat.jpeg
HTTP/1.1 200 OK
Server: openresty/1.21.4.1
Date: Fri, 21 Jul 2023 10:41:12 GMT
Content-Type: image/jpeg
Content-Length: 5891
Connection: keep-alive
Last-Modified: Thu, 20 Jul 2023 10:08:21 GMT
ETag: "64b90795-1703"
X-Cache-Status: HIT
Accept-Ranges: bytes
```

### PURGE

```
curl -I -X PURGE localhost:8080/images/cat.jpeg
HTTP/1.1 200 OK
Server: openresty/1.21.4.1
Date: Fri, 21 Jul 2023 10:41:21 GMT
Content-Type: image/jpeg
Transfer-Encoding: chunked
Connection: keep-alive
```

### 404 again after purging cache:
```
curl -I -X GET localhost:8080/images/cat.jpeg  
HTTP/1.1 404 Not Found
Server: openresty/1.21.4.1
Date: Fri, 21 Jul 2023 10:46:33 GMT
Content-Type: text/html
Content-Length: 159
Connection: keep-alive
```